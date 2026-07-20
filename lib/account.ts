/**
 * The "account" layer: stores each user's role, wallet, and company link in
 * Clerk metadata (no separate database for the MVP).
 *
 * - publicMetadata  -> safe to read in the browser (role, address, join code…)
 * - privateMetadata -> server-only, NEVER sent to the browser (the wallet secret)
 *
 * NOTE: storing Stellar secrets in Clerk privateMetadata is a prototype shortcut,
 * not production custody. It stays server-side. Real custody comes later.
 */

import { clerkClient } from "@clerk/nextjs/server";
import { provisionWallet } from "@/lib/walletProvision";

export type Role = "owner" | "employee";

export interface OwnerPublic {
  role: "owner";
  companyName: string;
  joinCode: string;
  stellarAddress: string;
}

export interface EmployeePublic {
  role: "employee";
  ownerId: string;
  companyName: string;
  hourlyRate: number; // USD per hour, set by the owner
  stellarAddress: string;
  clockInAt: number | null; // epoch ms while clocked in, else null
}

/** Flat, loosely-typed shape of what we actually store in publicMetadata. */
export interface PublicMeta {
  role?: Role;
  companyName?: string;
  joinCode?: string;
  stellarAddress?: string; // owner: the COMPANY payroll-pool wallet
  ownerId?: string;
  hourlyRate?: number;
  clockInAt?: number | null;
  // Owner-as-worker: owners also clock in and pay THEMSELVES from the pool into
  // their own personal wallet (separate from the company pool).
  selfAddress?: string; // owner's personal Puddle wallet (their paycheck lands here)
  selfHourlyRate?: number;
  selfClockInAt?: number | null;
}

/** A live roster entry shown on the owner dashboard (owner self + employees). */
export interface RosterMember {
  id: string;
  name: string;
  isOwner: boolean;
  hourlyRate: number;
  clockInAt: number | null;
}

interface PrivateMeta {
  stellarSecret?: string; // owner: company pool secret; employee: their wallet secret
  selfSecret?: string; // owner's personal wallet secret
}

export async function getClient() {
  return clerkClient();
}

/** Generate a short, shareable company join code (e.g. "PUDL-7QX2"). */
export function generateJoinCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no easily-confused chars
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `PUDL-${code}`;
}

export async function getPublicMeta(userId: string): Promise<PublicMeta> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return (user.publicMetadata ?? {}) as PublicMeta;
}

async function getPrivateMeta(userId: string): Promise<PrivateMeta> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return (user.privateMetadata ?? {}) as PrivateMeta;
}

async function updatePrivateMeta(userId: string, patch: PrivateMeta): Promise<void> {
  const client = await clerkClient();
  const current = await getPrivateMeta(userId);
  await client.users.updateUserMetadata(userId, {
    privateMetadata: { ...current, ...patch },
  });
}

/** Read a user's main wallet secret (pool for owners, wallet for employees). */
export async function getWalletSecret(userId: string): Promise<string | null> {
  return (await getPrivateMeta(userId)).stellarSecret ?? null;
}

/** Read an owner's personal wallet secret. Server-only. */
export async function getSelfSecret(userId: string): Promise<string | null> {
  return (await getPrivateMeta(userId)).selfSecret ?? null;
}

export async function updatePublicMeta(userId: string, patch: PublicMeta): Promise<void> {
  const client = await clerkClient();
  const current = await getPublicMeta(userId);
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { ...current, ...patch },
  });
}

export async function setWalletSecret(userId: string, secret: string): Promise<void> {
  await updatePrivateMeta(userId, { stellarSecret: secret });
}

export async function setSelfSecret(userId: string, secret: string): Promise<void> {
  await updatePrivateMeta(userId, { selfSecret: secret });
}

/**
 * Find the owner whose company join code matches. Scans users (fine at MVP
 * scale; move to a real lookup/DB when this grows).
 */
export async function findOwnerByJoinCode(
  joinCode: string
): Promise<{ id: string; meta: OwnerPublic } | null> {
  const client = await clerkClient();
  const { data } = await client.users.getUserList({ limit: 500 });
  for (const u of data) {
    const meta = (u.publicMetadata ?? {}) as PublicMeta;
    if (meta.role === "owner" && meta.joinCode === joinCode) {
      return { id: u.id, meta: meta as OwnerPublic };
    }
  }
  return null;
}

/** List all employees belonging to an owner (scan — MVP scale). */
export async function listEmployees(
  ownerId: string
): Promise<Array<{ id: string; name: string; meta: EmployeePublic }>> {
  const client = await clerkClient();
  const { data } = await client.users.getUserList({ limit: 500 });
  const employees: Array<{ id: string; name: string; meta: EmployeePublic }> = [];
  for (const u of data) {
    const meta = (u.publicMetadata ?? {}) as PublicMeta;
    if (meta.role === "employee" && meta.ownerId === ownerId) {
      const name =
        [u.firstName, u.lastName].filter(Boolean).join(" ") ||
        u.emailAddresses[0]?.emailAddress ||
        "Employee";
      employees.push({ id: u.id, name, meta: meta as EmployeePublic });
    }
  }
  return employees;
}

/**
 * Ensure an owner has a personal wallet (separate from the company pool).
 * Heals owners created before personal wallets existed. Returns the address.
 */
export async function ensureOwnerSelfWallet(ownerId: string): Promise<string> {
  const meta = await getPublicMeta(ownerId);
  if (meta.selfAddress) return meta.selfAddress;
  const { address, secret } = await provisionWallet();
  await setSelfSecret(ownerId, secret);
  await updatePublicMeta(ownerId, { selfAddress: address });
  return address;
}

/** Build the live roster for an owner: the owner (as a worker) plus employees. */
export async function getRosterFor(ownerId: string): Promise<RosterMember[]> {
  const client = await clerkClient();
  const owner = await client.users.getUser(ownerId);
  const ownerMeta = (owner.publicMetadata ?? {}) as PublicMeta;
  const ownerName =
    [owner.firstName, owner.lastName].filter(Boolean).join(" ") ||
    owner.emailAddresses[0]?.emailAddress ||
    "Owner";

  const self: RosterMember = {
    id: ownerId,
    name: `${ownerName} (You)`,
    isOwner: true,
    hourlyRate: ownerMeta.selfHourlyRate ?? 0,
    clockInAt: ownerMeta.selfClockInAt ?? null,
  };

  const employees = await listEmployees(ownerId);
  const employeeMembers: RosterMember[] = employees.map((e) => ({
    id: e.id,
    name: e.name,
    isOwner: false,
    hourlyRate: e.meta.hourlyRate,
    clockInAt: e.meta.clockInAt,
  }));

  return [self, ...employeeMembers];
}

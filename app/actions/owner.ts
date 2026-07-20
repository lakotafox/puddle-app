"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { provisionWallet } from "@/lib/walletProvision";
import { swap, sendPayment } from "@/lib/stellarApi";
import {
  generateJoinCode,
  getPublicMeta,
  getWalletSecret,
  updatePublicMeta,
  setWalletSecret,
  setSelfSecret,
  getRosterFor,
  type RosterMember,
} from "@/lib/account";

async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not signed in");
  return userId;
}

/** Become an owner: create the company, a payroll pool wallet, and a join code. */
export async function becomeOwner(companyName: string): Promise<void> {
  const userId = await requireUserId();
  const existing = await getPublicMeta(userId);
  if (existing.role) return; // already onboarded

  // Two wallets: the company payroll pool, and the owner's personal wallet.
  const pool = await provisionWallet();
  const self = await provisionWallet();
  await setWalletSecret(userId, pool.secret);
  await setSelfSecret(userId, self.secret);
  await updatePublicMeta(userId, {
    role: "owner",
    companyName: companyName.trim() || "My Company",
    joinCode: generateJoinCode(),
    stellarAddress: pool.address,
    selfAddress: self.address,
    selfHourlyRate: 0,
    selfClockInAt: null,
  });
  revalidatePath("/dashboard");
}

/**
 * Load the payroll pool with USDC. On testnet the pool already holds free XLM
 * (from Friendbot at provision), so we swap `amount` XLM → USDC. Testnet DEX
 * rates/liquidity vary, so the resulting USDC is approximate.
 */
export async function fundPool(amount: number): Promise<void> {
  const userId = await requireUserId();
  const meta = await getPublicMeta(userId);
  if (meta.role !== "owner" || !meta.stellarAddress) throw new Error("Not an owner");
  if (!(amount > 0)) throw new Error("Amount must be greater than 0");

  const secret = await getWalletSecret(userId);
  if (!secret) throw new Error("Wallet not found");

  await swap({
    sourceAddress: meta.stellarAddress,
    sourceSecret: secret,
    fromAsset: "XLM",
    toAsset: "USDC",
    amount,
  });
  revalidatePath("/dashboard");
}

/** Owner sets an employee's hourly rate (USD/hour). */
export async function setEmployeeRate(employeeId: string, hourlyRate: number): Promise<void> {
  const ownerId = await requireUserId();
  const empMeta = await getPublicMeta(employeeId);
  if (empMeta.role !== "employee" || empMeta.ownerId !== ownerId) {
    throw new Error("Not your employee");
  }
  await updatePublicMeta(employeeId, { hourlyRate: Math.max(0, hourlyRate) });
  revalidatePath("/dashboard");
}

/** Owner sets their OWN hourly rate (they're a worker too). */
export async function setOwnRate(hourlyRate: number): Promise<void> {
  const ownerId = await requireUserId();
  await updatePublicMeta(ownerId, { selfHourlyRate: Math.max(0, hourlyRate) });
  revalidatePath("/dashboard");
}

/** Owner clocks themselves in. */
export async function clockInSelf(): Promise<void> {
  const ownerId = await requireUserId();
  await updatePublicMeta(ownerId, { selfClockInAt: Date.now() });
  revalidatePath("/dashboard");
}

/**
 * Owner clocks themselves out and gets paid: transfers hours × rate from the
 * company pool into their own personal wallet (same as an employee).
 */
export async function clockOutSelf(): Promise<void> {
  const ownerId = await requireUserId();
  const meta = await getPublicMeta(ownerId);
  if (meta.role !== "owner" || meta.selfClockInAt == null) return;

  const hours = (Date.now() - meta.selfClockInAt) / 3_600_000;
  const amount = Math.round(hours * (meta.selfHourlyRate ?? 0) * 100) / 100;

  if (amount > 0 && meta.stellarAddress && meta.selfAddress) {
    try {
      const poolSecret = await getWalletSecret(ownerId);
      if (poolSecret) {
        await sendPayment({
          sourceAddress: meta.stellarAddress,
          sourceSecret: poolSecret,
          destinationAddress: meta.selfAddress,
          amount,
          assetType: "USDC",
        });
      }
    } catch {
      /* still clock out even if the payment fails */
    }
  }

  await updatePublicMeta(ownerId, { selfClockInAt: null });
  revalidatePath("/dashboard");
}

/** Live roster (owner self + employees) for the owner dashboard to poll. */
export async function getRoster(): Promise<RosterMember[]> {
  const ownerId = await requireUserId();
  return getRosterFor(ownerId);
}

"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { provisionWallet } from "@/lib/walletProvision";
import { sendPayment } from "@/lib/stellarApi";
import {
  findOwnerByJoinCode,
  getPublicMeta,
  getWalletSecret,
  updatePublicMeta,
  setWalletSecret,
} from "@/lib/account";

async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not signed in");
  return userId;
}

/** Join a company with its code: links to the owner and provisions a wallet. */
export async function joinCompany(joinCode: string): Promise<void> {
  const userId = await requireUserId();
  const existing = await getPublicMeta(userId);
  if (existing.role) return; // already onboarded

  const owner = await findOwnerByJoinCode(joinCode.trim().toUpperCase());
  if (!owner) throw new Error("Invalid join code");

  const { address, secret } = await provisionWallet();
  await setWalletSecret(userId, secret);
  await updatePublicMeta(userId, {
    role: "employee",
    ownerId: owner.id,
    companyName: owner.meta.companyName,
    hourlyRate: 0,
    stellarAddress: address,
    clockInAt: null,
  });
  revalidatePath("/dashboard");
}

export async function clockIn(): Promise<void> {
  const userId = await requireUserId();
  const meta = await getPublicMeta(userId);
  if (meta.role !== "employee") throw new Error("Not an employee");
  await updatePublicMeta(userId, { clockInAt: Date.now() });
  revalidatePath("/dashboard");
}

export interface ClockOutResult {
  hours: number;
  amount: number;
  paid: boolean;
  error?: string;
}

/**
 * Clock out → pay for the session. Computes hours × rate and sends USDC from
 * the owner's pool to this employee's wallet (the "handshake").
 */
export async function clockOut(): Promise<ClockOutResult> {
  const userId = await requireUserId();
  const meta = await getPublicMeta(userId);
  if (meta.role !== "employee" || !meta.clockInAt) throw new Error("Not clocked in");

  const hours = (Date.now() - meta.clockInAt) / 3_600_000;
  const amount = Math.round(hours * (meta.hourlyRate ?? 0) * 100) / 100; // USD, 2dp

  let paid = false;
  let error: string | undefined;

  if (amount > 0 && meta.ownerId && meta.stellarAddress) {
    try {
      const ownerSecret = await getWalletSecret(meta.ownerId);
      const ownerMeta = await getPublicMeta(meta.ownerId);
      if (!ownerSecret || !ownerMeta.stellarAddress) throw new Error("Owner wallet unavailable");
      await sendPayment({
        sourceAddress: ownerMeta.stellarAddress,
        sourceSecret: ownerSecret,
        destinationAddress: meta.stellarAddress,
        amount,
        assetType: "USDC",
      });
      paid = true;
    } catch (e) {
      error = e instanceof Error ? e.message : "Payment failed";
    }
  }

  // Always clock out, even if payment failed (so they aren't stuck clocked in).
  await updatePublicMeta(userId, { clockInAt: null });
  revalidatePath("/dashboard");
  return { hours, amount, paid, error };
}

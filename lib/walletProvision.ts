/**
 * Provisions a ready-to-use wallet: create keypair -> fund (testnet) -> add USDC
 * trustline. Returns the credentials so the caller can store them securely.
 * Pure Stellar logic; no auth/storage here.
 */

import { createWallet, addTrustline, type WalletCredentials } from "@/lib/stellarApi";
import { fundWithFriendbot } from "@/lib/friendbot";

export async function provisionWallet(): Promise<WalletCredentials> {
  const { address, secret } = await createWallet();
  await fundWithFriendbot(address);
  await addTrustline(address, secret);
  return { address, secret };
}

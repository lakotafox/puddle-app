/**
 * Stellar testnet faucet. Funds a brand-new account with free test XLM so it
 * exists on the network (required before it can hold USDC or transact).
 */

const FRIENDBOT_URL = "https://horizon-testnet.stellar.org/friendbot";

export async function fundWithFriendbot(address: string): Promise<void> {
  const res = await fetch(`${FRIENDBOT_URL}?addr=${encodeURIComponent(address)}`);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const alreadyFunded = JSON.stringify(body ?? "").includes("op_already_exists");
    if (!alreadyFunded) {
      throw new Error("Friendbot funding failed");
    }
  }
}

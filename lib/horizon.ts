/**
 * Reads wallet balances directly from Stellar's public Horizon API.
 * (Eli's backend has no balance endpoint, and Horizon is CORS-friendly.)
 */

const HORIZON_URL = "https://horizon-testnet.stellar.org";

export interface WalletBalances {
  funded: boolean;
  /** USDC balance as a number (shown to users as USD). */
  usd: number;
  /** Native XLM balance (used for fees / swapping). */
  xlm: number;
}

export async function getBalances(address: string): Promise<WalletBalances> {
  const res = await fetch(`${HORIZON_URL}/accounts/${address}`, { cache: "no-store" });

  // An unfunded account doesn't exist yet on the network — a normal state.
  if (res.status === 404) {
    return { funded: false, usd: 0, xlm: 0 };
  }
  if (!res.ok) {
    throw new Error(`Failed to read balance (${res.status})`);
  }

  const data = await res.json();
  let usd = 0;
  let xlm = 0;
  for (const b of data.balances ?? []) {
    if (b.asset_type === "native") {
      xlm = parseFloat(b.balance);
    } else if (b.asset_code === "USDC") {
      usd = parseFloat(b.balance);
    }
  }
  return { funded: true, usd, xlm };
}

/**
 * Typed client for Eli's Stellar backend (puddl3_backend).
 * Server-side only — these calls handle wallet creation/trustlines/payments.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";
const API_V1 = "/api/v1";

export interface WalletCredentials {
  address: string;
  secret: string;
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${API_V1}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.error || `Backend error (${res.status})`);
  }
  return res.json() as Promise<T>;
}

/** Create a new Stellar wallet (keypair). */
export async function createWallet(): Promise<WalletCredentials> {
  const data = await post<{ wallet: WalletCredentials }>("/wallet/create");
  return data.wallet;
}

/** Add a USDC trustline so a wallet can receive USDC. */
export async function addTrustline(address: string, secret: string): Promise<void> {
  await post("/trustline/add", { address, secret });
}

/** Send a one-time payment (e.g. owner pool → employee) in USDC or XLM. */
export async function sendPayment(params: {
  sourceAddress: string;
  sourceSecret: string;
  destinationAddress: string;
  amount: number;
  assetType?: "USDC" | "XLM";
}): Promise<{ transaction_hash: string; amount: number }> {
  return post("/payment/send", {
    source_address: params.sourceAddress,
    source_secret: params.sourceSecret,
    destination_address: params.destinationAddress,
    asset_type: params.assetType ?? "USDC",
    amount: params.amount,
  });
}

/** Swap one asset for another via the Stellar DEX (e.g. XLM → USDC to fund a pool). */
export async function swap(params: {
  sourceAddress: string;
  sourceSecret: string;
  fromAsset: "XLM" | "USDC";
  toAsset: "XLM" | "USDC";
  amount: number;
}): Promise<{ transaction_hash: string }> {
  return post("/swap/execute", {
    source_address: params.sourceAddress,
    source_secret: params.sourceSecret,
    from_asset: params.fromAsset,
    to_asset: params.toAsset,
    amount: params.amount,
  });
}

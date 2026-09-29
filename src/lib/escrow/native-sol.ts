const LAMPORTS_PER_SOL = 1_000_000_000n;
const BPS_DENOMINATOR = 10_000n;

export function parseLamports(value: string | number | bigint): bigint {
  const text = String(value).trim();
  if (!/^(0|[1-9]\d*)$/.test(text)) throw new Error("Lamports must be a non-negative integer");
  return BigInt(text);
}

export function formatLamports(lamports: bigint, maximumFractionDigits = 9): string {
  if (lamports < 0n) throw new Error("Lamports must be non-negative");
  const whole = lamports / LAMPORTS_PER_SOL;
  const fraction = (lamports % LAMPORTS_PER_SOL).toString().padStart(9, "0").slice(0, maximumFractionDigits);
  return fraction.replace(/0+$/, "") ? `${whole}.${fraction.replace(/0+$/, "")}` : whole.toString();
}

export function calculateFee(lamports: bigint, feeBps: number): bigint {
  if (!Number.isInteger(feeBps) || feeBps < 0 || feeBps > 1_000) throw new Error("Fee must be between 0 and 1000 bps");
  return (lamports * BigInt(feeBps)) / BPS_DENOMINATOR;
}

export function calculatePayout(lamports: bigint, feeBps: number): bigint {
  const fee = calculateFee(lamports, feeBps);
  if (fee > lamports) throw new Error("Fee exceeds amount");
  return lamports - fee;
}

export function estimateDebit(amount: bigint, transactionFeeLamports: bigint, rentLamports = 0n): bigint {
  if (amount < 0n) throw new Error("Amount must be non-negative");
  if (transactionFeeLamports < 0n) throw new Error("Transaction fee must be non-negative");
  if (rentLamports < 0n) throw new Error("Rent must be non-negative");
  return amount + transactionFeeLamports + rentLamports;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return bytesToHex(new Uint8Array(digest));
}

/** Canonical digest used by the escrow PDA seed; terms remain private/off-chain. */
export function gigDigest(gigId: string): Promise<string> {
  const canonicalUuid = gigId.trim().toLowerCase();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(canonicalUuid)) {
    throw new Error("gigId must be a valid UUID");
  }
  return sha256(`micro-gig-network:devnet:gig:${canonicalUuid}`);
}

export function deterministicTermsPayload(terms: Record<string, string | number | boolean>): string {
  return Object.keys(terms).sort().map((key) => `${key}=${String(terms[key])}`).join("\n");
}

export function deterministicTermsHash(terms: Record<string, string | number | boolean>): Promise<string> {
  return sha256(deterministicTermsPayload(terms));
}

export { LAMPORTS_PER_SOL };

export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export function hexToBytes32(hex: string): Uint8Array {
  const bytes = hexToBytes(hex);
  if (bytes.length !== 32) throw new Error("Expected 32 bytes from hex string");
  return bytes;
}

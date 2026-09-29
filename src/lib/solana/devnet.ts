import { z } from "zod";

export const DEVNET_RPC_URL = "https://api.devnet.solana.com";
export const DEVNET_CLUSTER = "devnet";
export const PROOF_MEMO = "micro-gig-network:devnet-proof:v1";

const base58Signature = /^[1-9A-HJ-NP-Za-km-z]{64,88}$/;
const base58Address = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export const proofRequestSchema = z.object({
  signature: z.string().regex(base58Signature),
});

export function isValidSignature(value: string): boolean {
  return base58Signature.test(value);
}

export function isValidAddress(value: string): boolean {
  return base58Address.test(value);
}

export function shortenAddress(value: string, chars = 4): string {
  if (!value || value.length <= chars * 2) return value;
  return `${value.slice(0, chars)}…${value.slice(-chars)}`;
}

export function explorerTransactionUrl(signature: string): string {
  if (!isValidSignature(signature)) {
    throw new Error("Invalid transaction signature");
  }
  return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
}

export type ProofLifecycle =
  | "disconnected"
  | "ready"
  | "waiting"
  | "submitted"
  | "confirming"
  | "confirmed"
  | "rejected"
  | "failed"
  | "unknown";

const transitions: Record<ProofLifecycle, readonly ProofLifecycle[]> = {
  disconnected: ["ready"],
  ready: ["waiting", "disconnected"],
  waiting: ["submitted", "rejected", "failed"],
  submitted: ["confirming", "failed", "unknown"],
  confirming: ["confirmed", "failed", "unknown"],
  confirmed: ["ready", "disconnected"],
  rejected: ["ready", "disconnected"],
  failed: ["ready", "disconnected"],
  unknown: ["ready", "disconnected"],
};

export function canTransition(from: ProofLifecycle, to: ProofLifecycle): boolean {
  return transitions[from].includes(to);
}

export function mapWalletError(error: unknown): {
  state: Extract<ProofLifecycle, "rejected" | "failed">;
  message: string;
} {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  if (message.includes("reject") || message.includes("denied") || message.includes("declined") || message.includes("user abort")) {
    return { state: "rejected", message: "Người dùng đã từ chối yêu cầu trong ví." };
  }
  if (message.includes("wallet") && (message.includes("not found") || message.includes("available"))) {
    return { state: "failed", message: "Không tìm thấy ví tương thích. Hãy cài và mở rộng ví Solana." };
  }
  if (message.includes("rpc") || message.includes("network") || message.includes("fetch") || message.includes("timeout")) {
    return { state: "failed", message: "Không thể kết nối Devnet RPC. Vui lòng thử lại." };
  }
  return { state: "failed", message: "Không thể hoàn tất giao dịch kiểm tra." };
}

export function mapVerificationError(code: string): string {
  switch (code) {
    case "INVALID_SIGNATURE":
      return "Chữ ký giao dịch không hợp lệ.";
    case "NOT_CONFIRMED":
      return "Giao dịch chưa được Devnet xác nhận.";
    case "INVALID_PROOF":
      return "Giao dịch không chứa bằng chứng kỹ thuật hợp lệ.";
    default:
      return "Không thể xác minh giao dịch.";
  }
}

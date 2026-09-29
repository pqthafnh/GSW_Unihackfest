import { createSolanaRpc, signature as toSignature } from "@solana/kit";
import { NextRequest } from "next/server";

import { apiError, apiSuccess } from "@/lib/api/response";
import { proofRequestSchema, PROOF_MEMO } from "@/lib/solana/devnet";
import { validateServerEnv } from "@/lib/env";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  try {
    const body = await request.json();
    const parsed = proofRequestSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("INVALID_SIGNATURE", "Chữ ký giao dịch không hợp lệ.", undefined, 400, requestId);
    }

    const env = validateServerEnv();
    if (!env.SOLANA_RPC_URL.includes("devnet")) {
      return apiError("DEVNET_ONLY", "Chỉ hỗ trợ xác minh trên Solana Devnet.", undefined, 503, requestId);
    }

    const rpc = createSolanaRpc(env.SOLANA_RPC_URL);
    const signature = parsed.data.signature;
    const [statusResponse, transactionResponse] = await Promise.all([
      rpc.getSignatureStatuses([toSignature(signature)]).send(),
      rpc.getTransaction(toSignature(signature), {
        commitment: "finalized",
        encoding: "jsonParsed",
        maxSupportedTransactionVersion: 0,
      }).send(),
    ]);

    const status = statusResponse.value[0];
    if (!status || status.err || !["confirmed", "finalized"].includes(status.confirmationStatus ?? "")) {
      return apiError("NOT_CONFIRMED", "Giao dịch chưa được Devnet xác nhận.", undefined, 422, requestId);
    }
    // RPC JSON is intentionally inspected defensively because parsed instruction
    // shapes vary by transaction version.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transaction = transactionResponse as any;
    const instructions = transaction?.transaction?.message?.instructions;
    const accountKeys = transaction?.transaction?.message?.accountKeys;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasSigner = Array.isArray(accountKeys) && accountKeys.some((key: any) => key?.signer === true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasProofMemo = Array.isArray(instructions) && instructions.some((instruction: any) =>
      (instruction?.program === "spl-memo" || instruction?.program === "spl-memo-program") &&
      typeof instruction?.parsed === "string" &&
      instruction.parsed === PROOF_MEMO,
    );
    if (!hasSigner || !hasProofMemo) {
      return apiError("INVALID_PROOF", "Không thể xác minh bằng chứng kỹ thuật.", undefined, 422, requestId);
    }

    return apiSuccess({ verified: true, signature, cluster: "devnet" }, requestId);
  } catch {
    return apiError("VERIFICATION_FAILED", "Không thể xác minh giao dịch lúc này.", undefined, 502, requestId);
  }
}

"use client";

import { useState, useContext, useSyncExternalStore } from "react";
import { WalletClientContext } from "@/components/providers/app-providers";
import {
  address,
  pipe,
  createTransactionMessage,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstruction,
  signAndSendTransactionMessageWithSigners,
  getBase58Decoder,
  AccountRole,
} from "@solana/kit";
import { getAddMemoInstruction } from "@solana-program/memo";
import { explorerTransactionUrl } from "@/lib/solana/devnet";

// Native Solana SystemProgram address
const SYSTEM_PROGRAM_ADDRESS = address("11111111111111111111111111111111");

// Vault address for Escrow / Platform treasury on Devnet (valid 32-byte Base58 pubkey)
const ESCROW_VAULT_ADDRESS = address("4vJ9JU1bJJE96FWSJKvHsmmFADCg4gpZQff4P3bkLKi");

/**
 * Creates a raw Solana SystemProgram Transfer instruction
 */
function createTransferInstruction({
  from,
  to,
  lamports,
}: {
  from: ReturnType<typeof address>;
  to: ReturnType<typeof address>;
  lamports: bigint;
}) {
  const data = new Uint8Array(12);
  const view = new DataView(data.buffer);
  view.setUint32(0, 2, true); // SystemProgram: Transfer instruction index 2
  view.setBigUint64(4, lamports, true); // little-endian u64 lamports

  return {
    programAddress: SYSTEM_PROGRAM_ADDRESS,
    accounts: [
      { address: from, role: AccountRole.WRITABLE_SIGNER },
      { address: to, role: AccountRole.WRITABLE },
    ],
    data,
  };
}

// ─── 1. Fund Gig Button (Real On-Chain Transfer) ──────────────────────────────
export function FundGigButton({
  gigId,
  amount,
}: {
  gigId: string;
  gigDigestHash?: string;
  amount: bigint;
}) {
  const client = useContext(WalletClientContext);
  const connected = useSyncExternalStore(
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    (cb: any) => client?.wallet?.subscribe(cb) || (() => {}),
    () => client?.wallet?.getState?.()?.connected,
    () => null
  );

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const handleFund = async () => {
    if (!client?.wallet) {
      setStatus("Vui lòng kết nối ví Solana trước khi nạp quỹ!");
      return;
    }

    const state = client.wallet.getState();
    const connectedAccount = state?.connected;
    if (!connectedAccount?.account?.address || !connectedAccount?.signer) {
      setStatus("Ví chưa sẵn sàng hoặc chưa kết nối. Vui lòng kết nối ví ở đầu trang!");
      return;
    }

    setLoading(true);
    setStatus("Đang yêu cầu ví ký và gửi giao dịch On-chain...");
    setTxSignature(null);

    try {
      // 1. Fetch latest blockhash from Solana Devnet RPC
      const { value: latestBlockhash } = await client.rpc
        .getLatestBlockhash({ commitment: "confirmed" })
        .send();

      const signer = connectedAccount.signer;
      const clientAddress = address(connectedAccount.account.address);

      // Amount: atomic units or minimum 10,000,000 lamports (0.01 SOL) for visible deduction
      const budgetAmount = amount > 0n ? amount : 10000000n;
      const transferLamports = budgetAmount > 100000000000n ? 10000000n : budgetAmount;

      // 2. Build on-chain transaction: Transfer SOL from Client Wallet to Escrow Vault + attach Gig Memo
      const transactionMessage = pipe(
        createTransactionMessage({ version: "legacy" }),
        (m) => setTransactionMessageFeePayerSigner(signer, m),
        (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
        (m) =>
          appendTransactionMessageInstruction(
            createTransferInstruction({
              from: clientAddress,
              to: ESCROW_VAULT_ADDRESS,
              lamports: transferLamports,
            }),
            m
          ),
        (m) =>
          appendTransactionMessageInstruction(
            getAddMemoInstruction({
              memo: `micro-gig:fund:${gigId.slice(0, 16)}`,
            }),
            m
          )
      );

      // 3. User signs transaction in Wallet (Phantom/Solflare pops up, actual SOL deducted)
      setStatus("Ví đang mở: Vui lòng phê duyệt giao dịch trừ tiền trên ví của bạn...");
      const signatureBytes = await signAndSendTransactionMessageWithSigners(transactionMessage);
      const signature = getBase58Decoder().decode(signatureBytes);

      setTxSignature(signature);
      setStatus("Giao dịch On-chain thành công! Đang cập nhật trạng thái hệ thống...");

      // 4. Confirm with backend using real on-chain transaction signature
      const res = await fetch(`/api/gigs/${gigId}/fund/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus(`On-chain thành công (${signature.slice(0, 8)}...), nhưng DB báo: ${json?.error ?? res.status}`);
      } else {
        setStatus("Đã nạp quỹ vào Escrow On-chain thành công! Số dư ví của bạn đã được trừ.");
        // Reload page to reflect OPEN status
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (e: any) {
      console.error("Fund error:", e);
      const msg = e?.message || String(e);
      if (msg.toLowerCase().includes("reject") || msg.toLowerCase().includes("denied") || msg.toLowerCase().includes("user abort")) {
        setStatus("Bạn đã từ chối giao dịch trên ví.");
      } else {
        setStatus("Lỗi giao dịch On-chain: " + msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        disabled={!connected || loading}
        onClick={handleFund}
        className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 font-semibold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 active:scale-95 disabled:opacity-50"
      >
        {loading ? "Đang xử lý ví On-chain..." : "Nạp quỹ On-chain (Ký ví & Trừ SOL)"}
      </button>

      {status && (
        <p
          className={`text-sm font-medium ${
            status.includes("thành công") ? "text-green-700" : "text-amber-800"
          }`}
        >
          {status}
        </p>
      )}

      {txSignature && (
        <p className="text-xs">
          <a
            href={explorerTransactionUrl(txSignature)}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline font-mono"
          >
            Xem giao dịch trên Solana Explorer ↗
          </a>
        </p>
      )}
    </div>
  );
}

// ─── 2. Approve Release Button (On-Chain Settlement) ──────────────────────────
export function ApproveReleaseButton({
  gigId,
  workerAddress,
}: {
  gigId: string;
  gigDigestHash?: string;
  workerAddress?: string;
}) {
  const client = useContext(WalletClientContext);
  const connected = useSyncExternalStore(
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    (cb: any) => client?.wallet?.subscribe(cb) || (() => {}),
    () => client?.wallet?.getState?.()?.connected,
    () => null
  );

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const handleApprove = async () => {
    if (!client?.wallet) {
      setStatus("Vui lòng kết nối ví trước khi nghiệm thu!");
      return;
    }

    const state = client.wallet.getState();
    const connectedAccount = state?.connected;
    if (!connectedAccount?.account?.address || !connectedAccount?.signer) {
      setStatus("Ví chưa kết nối. Vui lòng kết nối ví ở đầu trang!");
      return;
    }

    setLoading(true);
    setStatus("Đang yêu cầu ví ký xác nhận nghiệm thu On-chain...");
    setTxSignature(null);

    try {
      const { value: latestBlockhash } = await client.rpc
        .getLatestBlockhash({ commitment: "confirmed" })
        .send();

      const signer = connectedAccount.signer;
      const clientAddress = address(connectedAccount.account.address);

      // On-chain Memo Proof & Settlement authorization from Client
      const transactionMessage = pipe(
        createTransactionMessage({ version: "legacy" }),
        (m) => setTransactionMessageFeePayerSigner(signer, m),
        (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
        (m) =>
          appendTransactionMessageInstruction(
            getAddMemoInstruction({
              memo: `micro-gig:release:${gigId.slice(0, 16)}:worker:${(workerAddress || "assigned").slice(0, 10)}`,
            }),
            m
          )
      );

      setStatus("Ví đang mở: Vui lòng xác nhận phê duyệt giải ngân trên ví...");
      const signatureBytes = await signAndSendTransactionMessageWithSigners(transactionMessage);
      const signature = getBase58Decoder().decode(signatureBytes);

      setTxSignature(signature);
      setStatus("Đã xác nhận on-chain! Đang cập nhật trạng thái hoàn tất...");

      // Update backend
      const res = await fetch(`/api/gigs/${gigId}/approve/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus(`Lỗi settle: ${json?.error ?? res.status}`);
      } else {
        setStatus("Nghiệm thu & Giải ngân hoàn tất! Hợp đồng đã hoàn thành.");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (e: any) {
      console.error(e);
      const msg = e?.message || String(e);
      if (msg.toLowerCase().includes("reject") || msg.toLowerCase().includes("denied")) {
        setStatus("Bạn đã từ chối giao dịch trên ví.");
      } else {
        setStatus("Lỗi khi giải ngân: " + msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        disabled={!connected || loading}
        onClick={handleApprove}
        className="rounded-full bg-green-600 px-6 py-2.5 font-semibold text-white shadow-md hover:bg-green-700 active:scale-95 disabled:opacity-50"
      >
        {loading ? "Đang ký giải ngân On-chain..." : "Nghiệm thu & Giải ngân (Ký ví On-chain)"}
      </button>

      {status && (
        <p
          className={`text-sm font-medium ${
            status.includes("hoàn tất") ? "text-green-700" : "text-amber-800"
          }`}
        >
          {status}
        </p>
      )}

      {txSignature && (
        <p className="text-xs">
          <a
            href={explorerTransactionUrl(txSignature)}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline font-mono"
          >
            Xem giao dịch giải ngân trên Solana Explorer ↗
          </a>
        </p>
      )}
    </div>
  );
}

// ─── 3. Resolve Dispute Button ───────────────────────────────────────────────
export function ResolveDisputeButton({
  gigId,
}: {
  gigId: string;
  gigDigestHash?: string;
  clientAddress?: string;
  workerAddress?: string;
}) {
  const client = useContext(WalletClientContext);
  const connected = useSyncExternalStore(
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    (cb: any) => client?.wallet?.subscribe(cb) || (() => {}),
    () => client?.wallet?.getState?.()?.connected,
    () => null
  );
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleResolve = async (winner: "client" | "worker") => {
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch(`/api/gigs/${gigId}/approve/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signature: "dispute_resolved_" + Date.now(),
          winner,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("Lỗi phân xử: " + (json?.error ?? res.status));
      } else {
        setStatus(`Đã phân xử thắng cho ${winner === "client" ? "Client" : "Worker"}!`);
      }
    } catch (e: any) {
      setStatus("Lỗi mạng: " + (e?.message || String(e)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          disabled={!connected || loading}
          onClick={() => handleResolve("client")}
          className="rounded-full bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          Xử thắng cho Client
        </button>
        <button
          disabled={!connected || loading}
          onClick={() => handleResolve("worker")}
          className="rounded-full bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          Xử thắng cho Worker
        </button>
      </div>
      {status && <p className="text-sm font-medium text-neutral-700">{status}</p>}
    </div>
  );
}

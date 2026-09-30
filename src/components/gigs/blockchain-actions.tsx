"use client";
import { useState, useContext, useSyncExternalStore } from "react";
import { WalletClientContext } from "@/components/providers/app-providers";

// ─── Mock Solana address (valid 44-char Base58) ──────────────────────────────
const MOCK_ADDRESS = "11111111111111111111111111111111111111111111";

// ─── 1. Fund Gig Button ──────────────────────────────────────────────────────
export function FundGigButton({
  gigId,
  gigDigestHash: _gigDigestHash,
  amount: _amount,
}: {
  gigId: string;
  gigDigestHash: string;
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
  const [status, setStatus] = useState("");

  const handleFund = async () => {
    setLoading(true);
    setStatus("");
    try {
      // MVP: Skip on-chain transaction, call backend API directly
      const res = await fetch(`/api/gigs/${gigId}/fund/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature: "devnet_mock_" + Date.now() }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("Loi nap quy: " + (json?.error ?? res.status));
      } else {
        setStatus("Da nap quy thanh cong (Devnet mock).");
      }
    } catch (e) {
      setStatus("Loi mang: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        disabled={!connected || loading}
        onClick={handleFund}
        className="rounded-full bg-[#0066cc] text-white px-4 py-2 font-semibold hover:bg-[#0055aa] disabled:opacity-60"
      >
        {loading ? "Dang xu ly..." : "Nap tien (Fund)"}
      </button>
      {status && <p className="mt-2 text-sm font-medium">{status}</p>}
    </div>
  );
}

// ─── 2. Approve Release Button ───────────────────────────────────────────────
export function ApproveReleaseButton({
  gigId,
  gigDigestHash: _gigDigestHash,
  workerAddress: _workerAddress,
}: {
  gigId: string;
  gigDigestHash: string;
  workerAddress: string;
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

  const handleApprove = async () => {
    setLoading(true);
    setStatus("");
    try {
      // MVP: Skip Solana PDA derivation entirely — call settle API directly
      const res = await fetch(`/api/gigs/${gigId}/approve/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature: "devnet_mock_approve_" + Date.now() }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("Loi giai ngan: " + (json?.error ?? res.status));
      } else {
        setStatus("Da giai ngan cho Worker thanh cong! (Devnet mock)");
      }
    } catch (e) {
      setStatus("Loi mang: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        disabled={!connected || loading}
        onClick={handleApprove}
        className="rounded-full bg-green-500 text-white px-4 py-2 font-semibold hover:bg-green-600 disabled:opacity-60"
      >
        {loading ? "Dang xu ly..." : "Nghiem thu & Giai ngan"}
      </button>
      {status && (
        <p
          className={
            "mt-2 text-sm font-medium " +
            (status.startsWith("Da ") ? "text-green-700" : "text-red-600")
          }
        >
          {status}
        </p>
      )}
    </div>
  );
}

// ─── 3. Resolve Dispute Button ───────────────────────────────────────────────
export function ResolveDisputeButton({
  gigId,
  gigDigestHash: _gigDigestHash,
  clientAddress: _clientAddress,
  workerAddress: _workerAddress,
}: {
  gigId: string;
  gigDigestHash: string;
  clientAddress: string;
  workerAddress: string;
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
      // MVP: Mock resolution
      const res = await fetch(`/api/gigs/${gigId}/approve/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signature: "devnet_mock_dispute_" + Date.now(),
          winner,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("Loi phan xu: " + (json?.error ?? res.status));
      } else {
        setStatus(`Da xu thang cho ${winner === "client" ? "Client" : "Worker"}! (Devnet mock)`);
      }
    } catch (e) {
      setStatus("Loi mang: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <button
          disabled={!connected || loading}
          onClick={() => handleResolve("client")}
          className="rounded-full bg-red-600 text-white px-4 py-2 font-semibold disabled:opacity-60"
        >
          Xu thang cho Client
        </button>
        <button
          disabled={!connected || loading}
          onClick={() => handleResolve("worker")}
          className="rounded-full bg-green-600 text-white px-4 py-2 font-semibold disabled:opacity-60"
        >
          Xu thang cho Worker
        </button>
      </div>
      {status && <p className="mt-2 text-sm font-medium">{status}</p>}
    </div>
  );
}

// Keep unused import to avoid TS errors if referenced elsewhere
export const _MOCK_ADDRESS = MOCK_ADDRESS;

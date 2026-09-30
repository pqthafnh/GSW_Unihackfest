"use client";
import { useState, useContext, useSyncExternalStore } from "react";
import { WalletClientContext } from "@/components/providers/app-providers";
import { address } from "@solana/kit";
import { getFundNativeSolInstruction, getPlatformConfigPda, getEscrowPda, getVaultPda, getResolveDisputeInstruction } from "@/lib/solana/escrow-client";

// Helper: tạo 32-byte digest từ gigId (mock: SHA-like hash bằng TextEncoder)
// Trong MVP: hash gigId thành 32 bytes bằng cách đơn giản (không cần crypto thật)
function mockDigest32(gigId: string): Uint8Array {
  const bytes = new Uint8Array(32);
  const encoded = new TextEncoder().encode(gigId);
  for (let i = 0; i < encoded.length && i < 32; i++) {
    bytes[i] = encoded[i];
  }
  return bytes;
}

// Mock Solana address (44-char Base58)
const MOCK_ADDRESS = "11111111111111111111111111111111111111111111";

// 1. Nut Fund (Nap tien vao quy)
export function FundGigButton({ gigId, gigDigestHash, amount }: { gigId: string; gigDigestHash: string; amount: bigint }) {
  const client = useContext(WalletClientContext);
  const connected = useSyncExternalStore(
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    (cb: any) => client?.wallet?.subscribe(cb) || (() => {}),
    () => client?.wallet?.getState?.()?.connected,
    () => null
  );
  const [loading, setLoading] = useState(false);

  const handleFund = async () => {
    if (!client || !client.wallet) return;
    setLoading(true);
    try {
      // Mock: dung 32 zero-bytes hoac hash tu gigId thay vi decode Base58
      const gigDigestBytes = mockDigest32(gigDigestHash || gigId);

      const [platformConfig] = await getPlatformConfigPda();
      const [escrowPda] = await getEscrowPda(gigDigestBytes);
      const [vaultPda] = await getVaultPda(escrowPda);

      const clientAddress = address(MOCK_ADDRESS);
      getFundNativeSolInstruction(escrowPda, platformConfig, clientAddress, vaultPda);

      // Goi API cap nhat trang thai
      await fetch(`/api/gigs/${gigId}/fund/confirm`, {
        method: "POST",
        body: JSON.stringify({ signature: "mock_signature_for_now" }),
      });

      alert("Nap quy thanh cong! (Devnet mock)");
    } catch (e) {
      console.error(e);
      alert("Loi khi nap quy: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button disabled={!connected || loading} onClick={handleFund} className="rounded-full bg-[#0066cc] text-white px-4 py-2 font-semibold hover:bg-[#0055aa]">
      {loading ? "Dang xu ly..." : "Nap tien (Fund)"}
    </button>
  );
}

// 2. Nut Resolve Dispute (Giai quyet khieu nai)
export function ResolveDisputeButton({ gigId, gigDigestHash, clientAddress, workerAddress }: { gigId: string; gigDigestHash: string; clientAddress: string; workerAddress: string }) {
  const client = useContext(WalletClientContext);
  const connected = useSyncExternalStore(
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    (cb: any) => client?.wallet?.subscribe(cb) || (() => {}),
    () => client?.wallet?.getState?.()?.connected,
    () => null
  );
  const [loading, setLoading] = useState(false);

  const handleResolve = async (clientAward: bigint, workerAward: bigint) => {
    if (!client || !client.wallet) return;
    setLoading(true);
    try {
      const gigDigestBytes = mockDigest32(gigDigestHash || gigId);

      const [escrowPda] = await getEscrowPda(gigDigestBytes);
      const [vaultPda] = await getVaultPda(escrowPda);

      const treasuryAddress = address(MOCK_ADDRESS);
      const arbiterAddress = address(MOCK_ADDRESS);

      getResolveDisputeInstruction(
        escrowPda,
        arbiterAddress,
        address(clientAddress || MOCK_ADDRESS),
        address(workerAddress || MOCK_ADDRESS),
        treasuryAddress,
        vaultPda,
        clientAward,
        workerAward
      );

      alert("Giai quyet khieu nai thanh cong! (Devnet mock)");
    } catch (e) {
      console.error(e);
      alert("Loi phan xu: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button disabled={!connected || loading} onClick={() => handleResolve(500n, 0n)} className="rounded-full bg-red-600 text-white px-4 py-2 font-semibold">
        Xu thang cho Client
      </button>
      <button disabled={!connected || loading} onClick={() => handleResolve(0n, 500n)} className="rounded-full bg-green-600 text-white px-4 py-2 font-semibold">
        Xu thang cho Worker
      </button>
    </div>
  );
}

// 3. Nut Approve Release (Phe duyet va giai ngan cho Worker)
import { getApproveReleaseInstruction } from "@/lib/solana/escrow-client";
export function ApproveReleaseButton({ gigId, gigDigestHash, workerAddress }: { gigId: string; gigDigestHash: string; workerAddress: string }) {
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
    if (!client || !client.wallet) return;
    setLoading(true);
    setStatus("");
    try {
      const gigDigestBytes = mockDigest32(gigDigestHash || gigId);
      const [escrowPda] = await getEscrowPda(gigDigestBytes);
      const [vaultPda] = await getVaultPda(escrowPda);

      const treasuryAddress = address(MOCK_ADDRESS);
      const clientAddress = address(MOCK_ADDRESS);

      getApproveReleaseInstruction(
        escrowPda,
        clientAddress,
        address(workerAddress || MOCK_ADDRESS),
        treasuryAddress,
        vaultPda
      );

      // Goi API settle (cap nhat DB)
      const res = await fetch(`/api/gigs/${gigId}/settle`, { method: "POST" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("Loi settle: " + (json?.error ?? res.status));
      } else {
        setStatus("Giai ngan thanh cong! (Devnet mock)");
      }
    } catch (e) {
      console.error(e);
      setStatus("Loi khi giai ngan: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button disabled={!connected || loading} onClick={handleApprove} className="rounded-full bg-green-500 text-white px-4 py-2 font-semibold hover:bg-green-600">
        {loading ? "Dang xu ly..." : "Nghiem thu & Giai ngan"}
      </button>
      {status && <p className="mt-2 text-sm font-medium">{status}</p>}
    </div>
  );
}

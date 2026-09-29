"use client";
import { useState, useContext, useSyncExternalStore } from "react";
import { WalletClientContext } from "@/components/providers/app-providers";
import { address, getBase58Encoder } from "@solana/kit";
import { getFundNativeSolInstruction, getPlatformConfigPda, getEscrowPda, getVaultPda, getResolveDisputeInstruction } from "@/lib/solana/escrow-client";

// 1. Nút Fund (Nạp tiền vào quỹ)
export function FundGigButton({ gigId, gigDigestHash, amount }: { gigId: string; gigDigestHash: string; amount: bigint }) {
  const client = useContext(WalletClientContext);
  const connected = useSyncExternalStore(
    (cb: any) => client?.wallet?.subscribe(cb) || (() => {}),
    () => client?.wallet?.getState?.()?.connected,
    () => null
  );
  const [loading, setLoading] = useState(false);

  const handleFund = async () => {
    if (!client || !client.wallet) return;
    setLoading(true);
    try {
      const gigDigestBytes = new Uint8Array(getBase58Encoder().encode(gigDigestHash));
      if (gigDigestBytes.length !== 32) throw new Error("gigDigest format incorrect");
      
      const [platformConfig] = await getPlatformConfigPda();
      const [escrowPda] = await getEscrowPda(gigDigestBytes);
      const [vaultPda] = await getVaultPda(escrowPda);

      // (Trong thực tế, bạn sẽ lấy public key từ ví kết nối hiện tại)
      const clientAddress = address("11111111111111111111111111111111111111111111"); // mock
      
      const ix = getFundNativeSolInstruction(escrowPda, platformConfig, clientAddress, vaultPda);
      
      // Ký và gửi transaction (sử dụng signAndSendTransaction)
      // await client.wallet.signAndSendTransaction(tx);
      
      // Gọi API cập nhật trạng thái
      await fetch(`/api/gigs/${gigId}/fund/confirm`, {
        method: "POST",
        body: JSON.stringify({ signature: "mock_signature_for_now" }),
      });
      
      alert("Nạp quỹ thành công!");
    } catch (e) {
      console.error(e);
      alert("Lỗi khi nạp quỹ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button disabled={!connected || loading} onClick={handleFund} className="rounded-full bg-[#0066cc] text-white px-4 py-2 font-semibold hover:bg-[#0055aa]">
      {loading ? "Đang xử lý..." : "Nạp tiền (Fund)"}
    </button>
  );
}

// 2. Nút Resolve Dispute (Giải quyết khiếu nại - Dành cho Admin/Arbiter)
export function ResolveDisputeButton({ gigId, gigDigestHash, clientAddress, workerAddress }: { gigId: string; gigDigestHash: string; clientAddress: string; workerAddress: string }) {
  const client = useContext(WalletClientContext);
  const connected = useSyncExternalStore(
    (cb: any) => client?.wallet?.subscribe(cb) || (() => {}),
    () => client?.wallet?.getState?.()?.connected,
    () => null
  );
  const [loading, setLoading] = useState(false);

  const handleResolve = async (clientAward: bigint, workerAward: bigint) => {
    if (!client || !client.wallet) return;
    setLoading(true);
    try {
      const gigDigestBytes = new Uint8Array(getBase58Encoder().encode(gigDigestHash));
      
      const [escrowPda] = await getEscrowPda(gigDigestBytes);
      const [vaultPda] = await getVaultPda(escrowPda);
      
      // Lấy treasury từ config
      const treasuryAddress = address("11111111111111111111111111111111111111111111"); // mock 
      const arbiterAddress = address("11111111111111111111111111111111111111111111"); // mock Admin wallet address

      const ix = getResolveDisputeInstruction(
        escrowPda,
        arbiterAddress,
        address(clientAddress),
        address(workerAddress),
        treasuryAddress,
        vaultPda,
        clientAward,
        workerAward
      );
      
      // Thực thi transaction...
      
      alert("Giải quyết khiếu nại thành công!");
    } catch (e) {
      console.error(e);
      alert("Lỗi phân xử.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button disabled={!connected || loading} onClick={() => handleResolve(500n, 0n)} className="rounded-full bg-red-600 text-white px-4 py-2 font-semibold">
        Xử thắng cho Client
      </button>
      <button disabled={!connected || loading} onClick={() => handleResolve(0n, 500n)} className="rounded-full bg-green-600 text-white px-4 py-2 font-semibold">
        Xử thắng cho Worker
      </button>
    </div>
  );
}

// 3. Nút Approve Release (Phê duyệt và giải ngân cho Worker)
import { getApproveReleaseInstruction } from "@/lib/solana/escrow-client";
export function ApproveReleaseButton({ gigId, gigDigestHash, workerAddress }: { gigId: string; gigDigestHash: string; workerAddress: string }) {
  const client = useContext(WalletClientContext);
  const connected = useSyncExternalStore(
    (cb: any) => client?.wallet?.subscribe(cb) || (() => {}),
    () => client?.wallet?.getState?.()?.connected,
    () => null
  );
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!client || !client.wallet) return;
    setLoading(true);
    try {
      const gigDigestBytes = new Uint8Array(getBase58Encoder().encode(gigDigestHash));
      const [escrowPda] = await getEscrowPda(gigDigestBytes);
      const [vaultPda] = await getVaultPda(escrowPda);

      // Treasury của nền tảng
      const treasuryAddress = address("11111111111111111111111111111111111111111111"); 
      // Lấy địa chỉ ví của Client hiện tại đang đăng nhập
      const clientAddress = address("11111111111111111111111111111111111111111111"); // mock

      const ix = getApproveReleaseInstruction(
        escrowPda,
        clientAddress,
        address(workerAddress),
        treasuryAddress,
        vaultPda
      );

      // Ký và gửi transaction lên mạng
      // await client.wallet.signAndSendTransaction(tx);

      alert("Giải ngân cho Worker thành công!");
    } catch (e) {
      console.error(e);
      alert("Lỗi khi giải ngân.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button disabled={!connected || loading} onClick={handleApprove} className="rounded-full bg-green-500 text-white px-4 py-2 font-semibold hover:bg-green-600">
      {loading ? "Đang xử lý..." : "Nghiệm thu & Giải ngân"}
    </button>
  );
}

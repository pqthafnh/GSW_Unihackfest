/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

const DEFAULT_WALLET_STATE = { wallets: [], connected: null, status: "disconnected" };

import { useContext, useState, useEffect, useSyncExternalStore } from "react";
import { WalletClientContext, WalletRescanContext } from "@/components/providers/app-providers";
import { shortenAddress,  } from "@/lib/solana/devnet";

function useWalletState(/* eslint-disable-next-line @typescript-eslint/no-explicit-any */ client: /* eslint-disable-next-line @typescript-eslint/no-explicit-any */ any) {
  return useSyncExternalStore(
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */ (onStoreChange: any) => client.wallet.subscribe(onStoreChange),
    () => client.wallet.getState(),
    () => DEFAULT_WALLET_STATE
  );
}

export function WalletSummary() {
  const client = useContext(WalletClientContext);
  const rescan = useContext(WalletRescanContext);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (!client) return null;

  // We have to conditionally call hooks safely, so we use an inner component or just call them here since client is rarely null.
  return <WalletSummaryInner client={client} rescan={rescan} balance={balance} setBalance={setBalance} message={message} setMessage={setMessage} />;
}

function WalletSummaryInner({ client, rescan, balance, setBalance, message, setMessage /* eslint-disable-next-line @typescript-eslint/no-explicit-any */ /* eslint-disable-next-line @typescript-eslint/no-explicit-any */ }: any) {
  const walletState = useWalletState(client);
  const address = walletState.connected?.account?.address as string | undefined;
  const isConnecting = walletState.status === "connecting";
  const noWallets = walletState.wallets.length === 0;

  async function refreshBalance() {
    if (!address) return;
    try {
      const result = await client.rpc.getBalance(address).send();
      setBalance(BigInt(result.value));
      setMessage(null);
    } catch {
      setMessage("Lỗi RPC");
    }
  }

  useEffect(() => {
    if (address) void refreshBalance();
    else setBalance(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  async function connect() {
    const wallet = walletState.wallets[0];
    if (!wallet) return;
    try {
      setMessage(null);
      await client.wallet.connect(wallet);
    } catch (e: /* eslint-disable-next-line @typescript-eslint/no-explicit-any */ any) {
      setMessage(e.message || "Lỗi kết nối");
    }
  }

  if (address) {
    return (
      <div className="flex items-center gap-3 text-xs bg-white border rounded-full px-3 py-1.5 shadow-sm">
        <span className="font-semibold text-green-600">Đã kết nối</span>
        <span className="font-mono">{shortenAddress(address)}</span>
        <span>{balance !== null ? `${Number(balance) / 1_000_000_000} SOL` : "..."}</span>
        <button onClick={refreshBalance} className="text-neutral-500 hover:text-black">↻</button>
        <button onClick={() => client.wallet.disconnect()} className="text-red-500 hover:text-red-700 font-semibold">Ngắt kết nối</button>
      </div>
    );
  }

  if (isConnecting) {
    return <span className="text-xs text-neutral-500 border rounded-full px-3 py-1.5 bg-gray-50">Đang kết nối...</span>;
  }

  if (noWallets) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-neutral-500 hidden md:inline">Không tìm thấy Phantom hoặc Solflare</span>
        <button onClick={rescan} className="border rounded-full px-3 py-1.5 bg-gray-50 hover:bg-gray-100">Quét lại ví</button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium hidden sm:inline">Solana Devnet</span>
      <span className="text-neutral-500 hidden lg:inline">Chưa kết nối ví</span>
      <button onClick={connect} className="bg-[#0066cc] text-white px-3 py-1.5 rounded-full font-semibold hover:bg-[#005bb5]">Kết nối ví</button>
      {message && <span className="text-red-500">{message}</span>}
    </div>
  );
}

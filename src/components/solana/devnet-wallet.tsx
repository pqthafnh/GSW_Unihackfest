"use client";
const DEFAULT_WALLET_STATE = { wallets: [], connected: null, status: "disconnected" as const };

import {
  appendTransactionMessageInstruction,
  pipe,

  createTransactionMessage,
  getBase58Decoder,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signAndSendTransactionMessageWithSigners,
} from "@solana/kit";



import { getAddMemoInstruction } from "@solana-program/memo";
import { useEffect, useSyncExternalStore, useState } from "react";

import {

  explorerTransactionUrl,
  mapVerificationError,
  mapWalletError,
  PROOF_MEMO,
  shortenAddress,
  type ProofLifecycle,
} from "@/lib/solana/devnet";

// The plugin client is structurally typed by its installed capabilities.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WalletClient = any;

function useWalletState(client: WalletClient) {
  return useSyncExternalStore(
    (onStoreChange) => client.wallet.subscribe(onStoreChange),
    () => client.wallet.getState(),
    () => DEFAULT_WALLET_STATE,
  );
}

function WalletPanel({ client }: { client: WalletClient }) {
  const walletState = useWalletState(client);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [lifecycle, setLifecycle] = useState<ProofLifecycle>(
    walletState.connected ? "ready" : "disconnected",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const address = walletState.connected?.account?.address as string | undefined;

  async function refreshBalance() {
    if (!address) return;
    try {
      const result = await client.rpc.getBalance(address).send();
      setBalance(BigInt(result.value));
      setMessage(null);
    } catch {
      setMessage("Không thể tải số dư Devnet. Vui lòng thử lại.");
    }
  }

  useEffect(() => {
    setLifecycle(address ? "ready" : "disconnected");
    if (address) void refreshBalance();
    else setBalance(null);
    // The wallet address is the only value that should trigger an RPC refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  async function connect() {
    const wallet = walletState.wallets[0];
    if (!wallet) {
      setMessage("Không tìm thấy ví tương thích. Hãy cài và mở rộng ví Solana.");
      return;
    }
    try {
      setMessage(null);
      await client.wallet.connect(wallet);
    } catch (error) {
      setMessage(mapWalletError(error).message);
    }
  }

  async function prove() {
    const connected = client.wallet.getState().connected;
    if (!connected?.account?.address) return;
    try {
      setMessage(null);
      setSignature(null);
      setLifecycle("waiting");
      const { value: latestBlockhash } = await client.rpc
        .getLatestBlockhash({ commitment: "confirmed" })
        .send();
      const signer = connected.signer;
      const transactionMessage = pipe(
        createTransactionMessage({ version: "legacy" }),
        (message) => setTransactionMessageFeePayerSigner(signer, message),
        (message) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, message),
        (message) => appendTransactionMessageInstruction(getAddMemoInstruction({ memo: PROOF_MEMO }), message),
      );
      const signatureBytes = await signAndSendTransactionMessageWithSigners(transactionMessage);
      const realSignature = getBase58Decoder().decode(signatureBytes);
      setSignature(realSignature);
      setLifecycle("submitted");
      setLifecycle("confirming");
      const response = await fetch("/api/technical/solana-proof", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ signature: realSignature }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        setLifecycle("failed");
        setMessage(mapVerificationError(result?.error?.code ?? "VERIFICATION_FAILED"));
        return;
      }
      setLifecycle("confirmed");
    } catch (error) {
      const mapped = mapWalletError(error);
      setLifecycle(mapped.state);
      setMessage(mapped.message);
    }
  }

  const lifecycleLabel: Record<ProofLifecycle, string> = {
    disconnected: "Chưa kết nối",
    ready: "Sẵn sàng",
    waiting: "Đang chờ xác nhận từ ví",
    submitted: "Đã gửi lên Devnet",
    confirming: "Đang xác nhận",
    confirmed: "Đã xác nhận",
    rejected: "Người dùng đã từ chối",
    failed: "Không thể xác minh",
    unknown: "Chưa rõ trạng thái xác nhận",
  };

  return (
    <section aria-labelledby="devnet-wallet-title" className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 id="devnet-wallet-title" className="text-xl font-semibold">Ví Solana Devnet</h2>
      <p className="mt-2 text-sm text-neutral-600">
        Chỉ dùng Devnet và giao dịch memo không có giá trị. Không phải thanh toán hay ký quỹ.
      </p>
      {!address ? (
        <button className="mt-5 rounded-full bg-[#0066cc] px-4 py-2 font-semibold text-white" onClick={connect}>
          Kết nối ví
        </button>
      ) : (
        <>
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="text-neutral-500">Địa chỉ ví</dt><dd className="font-mono">{shortenAddress(address)}</dd></div>
            <div><dt className="text-neutral-500">Số dư Devnet</dt><dd>{balance === null ? "Đang tải…" : `${Number(balance) / 1_000_000_000} SOL`}</dd></div>
          </dl>
          <div className="mt-5 flex flex-wrap gap-2">
            <button className="rounded-full border px-4 py-2 text-sm" onClick={() => void refreshBalance()}>Làm mới số dư</button>
            <button className="rounded-full border px-4 py-2 text-sm" onClick={() => void client.wallet.disconnect()}>Ngắt kết nối</button>
            <button className="rounded-full bg-[#0066cc] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" disabled={lifecycle === "waiting" || lifecycle === "confirming"} onClick={() => void prove()}>Ký giao dịch kiểm tra</button>
          </div>
        </>
      )}
      <p className="mt-4 text-sm" role="status">{lifecycleLabel[lifecycle]}</p>
      {message ? <p className="mt-2 text-sm text-red-600">{message}</p> : null}
      {signature && lifecycle === "confirmed" ? <a className="mt-3 inline-block text-sm text-[#0066cc] underline" href={explorerTransactionUrl(signature)} target="_blank" rel="noreferrer">Xem trên Solana Explorer</a> : null}
    </section>
  );
}

import { useContext } from "react";
import { WalletClientContext, WalletRescanContext } from "@/components/providers/app-providers";

export function DevnetWallet() {
  const client = useContext(WalletClientContext);
  const rescan = useContext(WalletRescanContext);
  if (!client) return null;
  return (
    <div>
      <WalletPanel client={client} />
      <div className="mt-4 border-t pt-4">
        <button onClick={rescan} className="text-sm font-medium text-[#0066cc] underline">Quét lại ví</button>
      </div>
    </div>
  );
}

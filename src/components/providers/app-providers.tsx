"use client";

import { useMemo, useState } from "react";
import { createClient } from "@solana/kit";
import { ClientProvider } from "@solana/react";
import { solanaDevnetRpc } from "@solana/kit-plugin-rpc";
import { walletSigner } from "@solana/kit-plugin-wallet";
import { DEVNET_RPC_URL } from "@/lib/solana/devnet";

import React from "react";
export const WalletRescanContext = React.createContext<() => void>(() => {});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const WalletClientContext = React.createContext<any>(null);

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [scanKey, setScanKey] = useState(0);

  const client = useMemo(
    () => {
      return createClient()
        .use(walletSigner({ chain: "solana:devnet" }))
        .use(solanaDevnetRpc({ rpcUrl: process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL || DEVNET_RPC_URL }));
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [scanKey]
  );

  const rescan = () => setScanKey(k => k + 1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (
    <WalletRescanContext.Provider value={rescan}>
      <WalletClientContext.Provider value={client}>
        <ClientProvider client={/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        client as any}>
          {children}
        </ClientProvider>
      </WalletClientContext.Provider>
    </WalletRescanContext.Provider>
  );
}

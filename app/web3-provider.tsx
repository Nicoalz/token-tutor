"use client";

import { getSigner } from "@/lib/utils";
import { ConnectedWallet, useWallets } from "@privy-io/react-auth";
import { Signer } from "ethers";
import { createContext, useEffect, useState } from "react";

export const Web3Context = createContext<{
  signer?: Signer;
}>({});

export default function Web3Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { wallets } = useWallets();
  const [signer, setSigner] = useState<Signer>();

  const fetchSigner = async (allWallets: ConnectedWallet) => {
    setSigner(await getSigner(allWallets));
  };

  useEffect(() => {
    if (wallets.length > 0) fetchSigner(wallets[0]);
  }, [wallets]);

  return (
    <Web3Context.Provider value={{ signer }}>{children}</Web3Context.Provider>
  );
}

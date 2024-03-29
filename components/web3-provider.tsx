"use client";

import { getSigner } from "@/lib/utils";
import { hasApproved } from "@/lib/contracts";
import { ConnectedWallet, useWallets } from "@privy-io/react-auth";
import { Signer } from "ethers";
import { createContext, useEffect, useState } from "react";

export const Web3Context = createContext<{
  signer?: Signer;
  approved?: boolean;
  update?: () => void;
  address?: string;
  setSismo?: (sismo: boolean) => void;
  sismo: boolean;
}>({
  sismo: false,
});

export default function Web3Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { wallets } = useWallets();
  const [signer, setSigner] = useState<Signer>();
  const [approved, setApproved] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [sismo, setSismo] = useState<boolean>(false);

  const fetchSigner = async (allWallets: ConnectedWallet) => {
    setSigner((await getSigner(allWallets)) as unknown as Signer);
  };

  const checkAllowance = async () => {
    setApproved(await hasApproved(signer));
  };

  const update = async () => {
    await checkAllowance();
  };

  useEffect(() => {
    if (wallets.length > 0) {
      fetchSigner(wallets[0]);
      setAddress(wallets[0].address);
    }
  }, [wallets]);

  useEffect(() => {
    if (signer) {
      checkAllowance();
    }
  }, [signer]);

  return (
    <Web3Context.Provider
      value={{ signer, approved, update, address, setSismo, sismo }}
    >
      {children}
    </Web3Context.Provider>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Web3Context } from "@/components/web3-provider";
import { useContext } from "react";
import { LoginButton } from "@/components/loginBtn";
export default function Trade() {
  const { signer } = useContext(Web3Context);
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-center  p-24 pt-56">
      <h1 className="text-7xl font-bold">
        <span className="text-secondary">Trade </span>your mentors time
      </h1>
      <p className="italic mt-5">Coming soon.</p>
      <p className="italic mt-5 text-xs font-thin">Trade it now on Blur, Opensea and more...</p>
    </main>
  );
}

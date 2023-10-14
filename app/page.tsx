"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Web3Context } from "@/components/web3-provider";
import { useContext } from "react";
import { LoginButton } from "@/components/loginBtn";
export default function Home() {
  const { signer } = useContext(Web3Context);
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-center  p-24 pt-56">
      <h1 className="text-7xl font-bold">
        Your time is <span className="text-secondary">valuable</span>
      </h1>
      <p className="italic mt-5">Stop wasting it.</p>
      {signer ? (
        <Button
          onClick={() => router.push("/learn")}
          className="bg-secondary px-10 py-2 mt-10 rounded-md text-white font-bold"
        >
          Get Started
        </Button>
      ) : (
        <div className="mt-8">
          <LoginButton />
        </div>
      )}
    </main>
  );
}

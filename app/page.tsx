"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-center  p-24 pt-56">
      <h1 className="text-7xl font-bold">
        Your time is <span className="text-secondary">valuable</span>
      </h1>
      <p className="italic mt-5">Stop wasting it.</p>
      <Button
        onClick={() => router.push("/learn")}
        className="bg-secondary px-10 py-2 mt-10 rounded-md text-white font-bold"
      >
        Get Started
      </Button>
    </main>
  );
}

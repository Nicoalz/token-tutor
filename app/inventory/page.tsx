"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Web3Context } from "@/components/web3-provider";
import { TimeToken, Tutor } from "@/lib/types";
import { contracts } from "@/lib/utils";
import { Contract } from "ethers";
import { WalletCards } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Inventory() {
  const router = useRouter();
  const { signer } = useContext(Web3Context);
  const [ownedTokens, setOwnedTokens] = useState<TimeToken[]>([]);
  const [loading, setLoading] = useState(true);
  const contract = new Contract(
    contracts.TutorTimeToken.address,
    contracts.TutorTimeToken.abi,
    signer
  );

  const getOwnedTokens = async () => {
    try {
      const ownedTokensFromContract = await contract.getAllTutorTimeForStudent(
        await signer!.getAddress()
      );
      const owned: TimeToken[] = [];
      for (const token of ownedTokensFromContract) {
        owned.push({
          tokenId: token[0],
          address: token[1],
          tutor: await getTutorName(token[1]),
          student: token[2],
          price: (token[3] / 10 ** 18).toString(),
          mintedAt: token[4],
          redeemedAt: token[5],
        });
      }
      setOwnedTokens(owned);
    } catch (e) {
      console.log(e);
    }
  };

  const getTutorName = async (address: string) => {
    const tutor: Tutor = await contract.addressToTutor(address);
    return tutor.name;
  };

  useEffect(() => {
    if (signer) {
      setLoading(true);
      getOwnedTokens();
      setLoading(false);
    } else {
      router.push("/");
    }
  }, [signer]);

  return (
    <main className="mx-32 mt-10 p-10 px-20 bg-[#181c2a] rounded-xl shadow-sm justify-center items-start relative">
      <h1 className="text-4xl font-bold mb-1">Inventory 🎒</h1>
      <p className=" font-light mb-5 text-sm">
        All time tokens that you own are listed below.
      </p>
      <div className="grid grid-cols-4 ">
        <WalletCards className="absolute w-36 h-36 text-6xl top-0 right-0 opacity-5" />
        {ownedTokens.length > 0 &&
          ownedTokens.map((timeToken, index) => {
            return (
              <div
                onClick={() => router.push(`/profile/${timeToken.address}`)}
                key={index}
                className="cursor-pointer hover:opacity-90 flex flex-col bg-white/10 w-52 p-3 rounded-xl"
              >
                <p className="text-xl font-bold">
                  <span className="text-secondary">{timeToken.tutor}</span>
                </p>
                <p className="text-md">
                  Bought for{" "}
                  <span className="text-secondary font-bold">
                    {parseFloat(timeToken.price)}
                  </span>
                </p>
                <p className="text-xs font-light text-muted ">
                  Minted on<br></br>
                  {new Date(
                    parseFloat(timeToken.mintedAt.toString()) * 1000
                  ).toLocaleString()}
                </p>
              </div>
            );
          })}
        {loading &&
          ["1", "2", "3"].map((_, index) => {
            return (
              <div
                key={index}
                className="animate-pulse flex flex-col bg-white/10 w-52 p-3 rounded-xl"
              >
                <Skeleton className="h-12 rounded-xl"></Skeleton>
                <Skeleton className="h-3 rounded-xl mt-2"></Skeleton>
                <Skeleton className="h-3 rounded-xl mt-2"></Skeleton>
                <Skeleton className="h-3 rounded-xl mt-2"></Skeleton>
              </div>
            );
          })}
      </div>
    </main>
  );
}

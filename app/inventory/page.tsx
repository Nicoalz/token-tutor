"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Web3Context } from "@/components/web3-provider";
import { TimeToken, Tutor } from "@/lib/types";
import { Contract } from "ethers";
import { WalletCards } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { getMainContract } from "@/lib/contracts";
export default function Inventory() {
  const router = useRouter();
  const { signer } = useContext(Web3Context);
  const [ownedTokens, setOwnedTokens] = useState<TimeToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState<Contract>({} as Contract);

  useEffect(() => {
    async function setContractAsync() {
      if (signer) {
        const contract = await getMainContract(signer);
        setContract(contract);
      }
    }
    setContractAsync();
  }, [signer]);

  const getOwnedTokens = async () => {
    try {
      console.log({ contract });
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

  const redeem = async (tokenId: number) => {
    const tx = await contract.burn(tokenId);
    setLoading(true);
    await tx.wait();
    await getOwnedTokens();
    setLoading(false);
  };

  useEffect(() => {
    if (signer && contract) {
      setLoading(true);
      getOwnedTokens();
      setLoading(false);
    } else {
      router.push("/");
    }
  }, [signer, contract]);

  return (
    <main className="mx-32 mt-10 p-10 px-20 bg-[#181c2a] rounded-xl shadow-sm justify-center items-start relative">
      <h1 className="text-4xl font-bold mb-1">Inventory 🎒</h1>
      <p className=" font-light mb-5 text-sm">
        All time tokens that you own are listed below.
      </p>
      <div className="grid grid-cols-4 ">
        <WalletCards className="absolute w-36 h-36 text-6xl top-0 right-0 opacity-5" />
        {ownedTokens.length > 0 &&
          !loading &&
          ownedTokens.map((timeToken, index) => {
            return (
              <div
                key={index}
                className="cursor-pointer hover:opacity-90 flex flex-col bg-white/10 w-52 p-3 rounded-xl"
              >
                <p className="text-xl font-bold">
                  <span className="text-secondary">{timeToken.tutor}</span>
                </p>
                <p className="text-md">
                  Bought for{" "}
                  <span className="text-secondary font-bold">
                    {parseFloat(timeToken.price)} USDC
                  </span>
                </p>
                <p className="text-xs font-light text-muted ">
                  Minted on<br></br>
                  {new Date(
                    parseFloat(timeToken.mintedAt.toString()) * 1000
                  ).toLocaleString()}
                </p>
                <Badge
                  className="text-center mt-3 ml-auto w-fit"
                  onClick={() => redeem(timeToken.tokenId)}
                >
                  Redeem
                </Badge>
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

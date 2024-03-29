"use client";
import Image from "next/image";
import { useEffect, useContext, useState } from "react";
import { Web3Context } from "../../components/web3-provider";
import { Contract } from "ethers";
import { Tutor } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";
import { getMainContract } from "@/lib/contracts";
export default function Learn() {
  const { signer } = useContext(Web3Context);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [savedTutors, setSavedTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
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

  const getAllTutors = async () => {
    setLoading(true);
    console.log({ contract });
    const tutorsFromContract = await contract.getAllTutors();
    console.log({ tutorsFromContract });
    const mappedTutors = tutorsFromContract.map((tutor: any) => {
      return {
        name: tutor[0],
        title: tutor[1],
        tutorAddress: tutor[2],
        mintedAmount: tutor[3].toString(),
        maxMint: tutor[4].toString(),
        hourPrice: tutor[5].toString(),
        description: tutor[6],
      };
    });
    setTutors(mappedTutors);
    setSavedTutors(mappedTutors);
    setLoading(false);
  };

  const handleSearch = (e: any) => {
    const value = e.target.value.toLowerCase();
    const filteredTutors = savedTutors.filter((tutor) => {
      return (
        tutor.tutorAddress.toLowerCase().includes(value) ||
        tutor.name.toLowerCase().includes(value) ||
        tutor.description.toLowerCase().includes(value) ||
        tutor.title.toLowerCase().includes(value)
      );
    });
    setTutors(filteredTutors);
  };

  const handleSort = (value: string) => {
    if (value === "asc") {
      const sortedTutors = [...tutors].sort((a, b) => {
        return parseFloat(a.hourPrice) - parseFloat(b.hourPrice);
      });
      setTutors(sortedTutors);
    } else if (value === "desc") {
      const sortedTutors = [...tutors].sort((a, b) => {
        return parseFloat(b.hourPrice) - parseFloat(a.hourPrice);
      });
      setTutors(sortedTutors);
    }
  };

  useEffect(() => {
    if (signer && contract) {
      getAllTutors();
    } else {
      router.push("/");
    }
  }, [router, signer, contract]);

  return (
    <main className="mx-32 my-10 p-10 bg-[#181c2a] rounded-xl shadow-sm">
      <h1 className="text-3xl mb-10 font-bold">What are you looking for?</h1>
      <div className="flex gap-5 mb-6">
        <Input
          placeholder="Search for tutors..."
          className=" w-6/12"
          onChange={handleSearch}
        />
        <Select onValueChange={handleSort}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Order By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Price Asc</SelectItem>
            <SelectItem value="desc">Price Desc</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-10">
        {tutors.length > 0 &&
          tutors.map((tutor, index) => {
            return (
              <div
                key={index}
                className="bg-[#262938] flex flex-col p-5 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition"
                onClick={() => {
                  router.push(`/profile/${tutor.tutorAddress}`);
                }}
              >
                <h1 className="text-2xl font-bold">{tutor.name}</h1>
                <h1 className="text-lg mb-3 font-bold text-secondary">
                  {tutor.title}
                </h1>
                <p className="text-xs break-words mb-1">{tutor.description}</p>
                <h1
                  className="text-xs text-muted hover:underline"
                  onClick={() => {
                    window.open(
                      `https://sepolia.etherscan.io/address/${tutor.tutorAddress}`
                    );
                  }}
                >
                  {tutor.tutorAddress.slice(0, 10) +
                    "..." +
                    tutor.tutorAddress.slice(-10)}{" "}
                  <Link className="w-3 h-3 inline-block" />
                </h1>
                <div className="flex justify-between">
                  <h2
                    className={` text-xs ${
                      parseFloat(tutor.maxMint) -
                        parseFloat(tutor.mintedAmount) >
                      0
                        ? "text-gray-500"
                        : "text-red-500"
                    }`}
                  >
                    Left:{" "}
                    {parseFloat(tutor.maxMint) - parseFloat(tutor.mintedAmount)}
                  </h2>
                  <h2 className="text-xs text-gray-500">
                    Minted: {tutor.mintedAmount}
                  </h2>
                </div>

                <h2 className="text-3xl font-bold  flex gap-2 ml-auto items-center">
                  {parseFloat(tutor.hourPrice) / 10 ** 18}
                  <span className="text-lg font-thin">USDC</span>
                </h2>
              </div>
            );
          })}
        {tutors.length === 0 && !loading && (
          <h1 className="text-gray-500 text-sm ">No tutors found...</h1>
        )}
        {loading &&
          [1, 2, 3, 4, 5].map((item, index) => {
            return (
              <div
                key={index}
                className="bg-white/5 flex flex-col p-5 rounded-lg shadow-sm gap-3"
              >
                <Skeleton className="w-8/12 h-[30px] rounded-full" />
                <Skeleton className="w-2/12 h-[15px] rounded-full" />
                <Skeleton className="w-4/12 h-[40px] ml-auto rounded-lg" />
              </div>
            );
          })}
      </div>
    </main>
  );
}

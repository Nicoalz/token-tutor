"use client";
import Image from "next/image";
import { useEffect, useContext, useState } from "react";
import { Web3Context } from "../web3-provider";
import { Contract } from "ethers";
import { contracts } from "@/lib/utils";
import { Tutor } from "@/lib/types";
import { EtherLogo } from "@/components/etherLogo";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function Learn() {
  const { signer } = useContext(Web3Context);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [savedTutors, setSavedTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getAllTutors = async () => {
    setLoading(true);
    const contract = new Contract(
      contracts.TutorTimeToken.address,
      contracts.TutorTimeToken.abi,
      signer
    );
    const tutorsFromContract = await contract.getAllTutors();
    const mappedTutors = tutorsFromContract.map((tutor: any) => {
      return {
        tutorAddress: tutor[0],
        mintedAmount: tutor[1].toString(),
        maxMint: tutor[2].toString(),
        hourPrice: tutor[3].toString(),
      };
    });
    setTutors(mappedTutors);
    setSavedTutors(mappedTutors);
    setLoading(false);
  };

  const handleSearch = (e: any) => {
    const value = e.target.value.toLowerCase();
    const filteredTutors = savedTutors.filter((tutor) => {
      return tutor.tutorAddress.toLowerCase().includes(value);
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
    if (signer) getAllTutors();
  }, [signer]);

  return (
    <main className="mx-32 my-10 p-10 bg-white/40 rounded-xl shadow-sm">
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
      <div className="grid grid-cols-4 gap-10">
        {tutors.length > 0 &&
          tutors.map((tutor, index) => {
            return (
              <div
                key={index}
                className="bg-white/30 flex flex-col p-5 border rounded-lg shadow-sm gap-3 cursor-pointer hover:shadow-md transition"
              >
                <h1 className="font-bold text-xl text-secondary">
                  {tutor.tutorAddress.slice(0, 6) +
                    "..." +
                    tutor.tutorAddress.slice(-4)}
                </h1>
                <div className="flex justify-between">
                  <h2
                    className={`font-bold text-xs ${
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

                <h2 className="text-3xl text-gray-800  flex gap-2 ml-auto">
                  {parseFloat(tutor.hourPrice) / 10 ** 18}
                  <EtherLogo width={20} height={20} />
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
                className="bg-white/30 flex flex-col p-5 border rounded-lg shadow-sm gap-3 hover:shadow-md transition"
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

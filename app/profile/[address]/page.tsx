"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Web3Context } from "@/components/web3-provider";
import { getUserOnChainData } from "@/lib/next-id";
import { Tutor } from "@/lib/types";
import { Contract } from "ethers";
import { Copy } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Avatar from "./avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Resume from "@/components/Resume";
import { useRouter } from "next/navigation";
import { getApePrice } from "@/lib/the-graph-uniswap-ape-price";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMainContract, approve } from "@/lib/contracts";

export default function Profile({ params }: { params: { address: string } }) {
  const { signer, approved, update } = useContext(Web3Context);
  const [tutor, setTutor] = useState<Tutor>();
  const [loadingMint, setLoadingMint] = useState(false);
  const [userData, setUserData] = useState<any>({});
  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isMe, setIsMe] = useState(true);
  const [isPriceUSDC, setIsPriceUSDC] = useState(true);
  const [apePrice, setApePrice] = useState<number>(0);
  const router = useRouter();
  const [contract, setContract] = useState<Contract>({} as Contract);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function setContractAsync() {
      if (signer) {
        const contract = await getMainContract(signer);
        setContract(contract);
      }
    }
    setContractAsync();
  }, [signer]);

  const mint = async () => {
    if (!tutor) return;
    setLoadingMint(true);
    const tx = await contract.safeMint(params.address);
    await tx.wait();
    setLoadingMint(false);
  };

  const getTutor = async () => {
    try {
      const tutorFromContract = await contract.addressToTutor(params.address);
      setTutor({
        name: tutorFromContract[0],
        title: tutorFromContract[1],
        tutorAddress: tutorFromContract[2],
        mintedAmount: tutorFromContract[3].toString(),
        maxMint: tutorFromContract[4].toString(),
        hourPrice: (tutorFromContract[5] / 10 ** 18).toString(),
        description: tutorFromContract[6],
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getUserData = async () => {
    const data = await getUserOnChainData(params.address);
    setUserData(data);
  };

  const checkIsMe = async () => {
    const address = await signer!.getAddress();
    setIsMe(address === params.address);
  };

  useEffect(() => {
    if (signer) {
      setLoading(true);
      checkIsMe();
      getTutor();
      getUserData();
      setLoading(false);
    } else {
      router.push("/");
    }
  }, [signer, router, contract]);

  useEffect(() => {
    async function getAPEvsETHPrice() {
      const apePrice = await getApePrice();
      if (!apePrice) return;
      setApePrice(apePrice);
    }
    getAPEvsETHPrice();
  }, []);

  return (
    <div className="mx-32 my-10 flex gap-10">
      <main className="w-9/12 p-10 bg-[#181c2a] rounded-xl shadow-sm flex gap-10 min-h-[32rem]">
        <div className="flex flex-col w-4/12 mr-10">
          {!loading && (
            <div className="flex flex-col ">
              <Avatar address={params.address} />
              <h1 className="font-bold text-4xl mb-3">
                {!userData.ENS
                  ? params.address.slice(0, 4) +
                    "..." +
                    params.address.slice(-4)
                  : userData.ENS}
              </h1>
              <div className="flex">
                <Badge className="mr-2 text-white" variant="secondary">
                  {tutor && tutor.maxMint != "0" ? "Tutor" : "Learner"}
                </Badge>
                <p
                  onClick={() => navigator.clipboard.writeText(params.address)}
                  className="hover:opacity-80 bg-[#ababab] text-[#434343] text-xs p-1 px-2 rounded-md flex items-center cursor-pointer"
                >
                  {params.address.slice(0, 6) +
                    "..." +
                    params.address.slice(-6)}
                  <Copy className="inline ml-2" size={12} />
                </p>
              </div>

              {tutor && tutor.maxMint != "0" && !isMe && (
                <div className="mt-5">
                  <Separator className="my-3 bg-white/30 h-[1px]" />
                  <h1 className="text-lg font-semibold">
                    Book a session with {tutor.name}
                  </h1>
                  <p className="text-xs text-secondary mb-2 font-light">
                    {tutor.title}
                  </p>

                  <p className="text-xs font-light">{tutor.description}</p>
                  <div className="flex items-center mt-4">
                    <p className="">
                      Price is
                      <span className="text-xl font-bold mx-2">
                        {isPriceUSDC
                          ? tutor.hourPrice
                          : (parseFloat(tutor.hourPrice) * apePrice).toFixed(2)}
                      </span>
                    </p>
                    <div className="w-[75px]">
                      <Select
                        onValueChange={(e) => {
                          if (e === "USDC") {
                            setIsPriceUSDC(true);
                          } else {
                            setIsPriceUSDC(false);
                          }
                        }}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="USDC" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="USDC">USDC</SelectItem>
                          <SelectItem value="APE">APE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-end mt-3">
                    {approved ? (
                      <Button
                        disabled={
                          parseFloat(tutor.maxMint) -
                            parseFloat(tutor.mintedAmount) ==
                          0
                        }
                        className="w-fit mr-3"
                        variant={"secondary"}
                        onClick={mint}
                      >
                        {" "}
                        {loadingMint ? "Loading..." : "Mint"}{" "}
                      </Button>
                    ) : (
                      <Button
                        className="w-fit mr-3"
                        variant={"secondary"}
                        onClick={async () => {
                          await approve(signer);
                          await update!();
                        }}
                      >
                        Approve
                      </Button>
                    )}
                    <p className="text-muted text-xs">
                      {parseFloat(tutor.maxMint) -
                        parseFloat(tutor.mintedAmount)}{" "}
                      left
                    </p>
                    <p className="text-muted text-xs ml-3">
                      {parseFloat(tutor.mintedAmount)} sold
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {loading && (
            <div>
              <Skeleton className="h-20 rounded-xl w-3/12 mb-3"></Skeleton>
              <Skeleton className="h-12 rounded-xl"></Skeleton>
              <Skeleton className="h-3 rounded-xl mt-2 w-6/12"></Skeleton>
              <Skeleton className="h-3 rounded-xl mt-2 w-6/12"></Skeleton>
            </div>
          )}
        </div>
        <div className="w-8/12 flex flex-col overflow-hidden">
          <div className="flex gap-3 overflow-x-auto w-full">
            {!loading &&
              userData.neighbors &&
              userData.neighbors.map(
                (
                  neighbor: {
                    displayName: string;
                    identity: string;
                    profileUrl: string;
                    source: string;
                  },
                  index: number
                ) => {
                  return (
                    <div
                      key={index}
                      onClick={() => window.open(neighbor.profileUrl, "_blank")}
                      className="cursor-pointer hover:shadow-xl transition-all hover:opacity-90 flex flex-col bg-white/10 w-52 p-3 rounded-xl"
                    >
                      {
                        <img
                          className={` ${
                            neighbor.source != "farcaster" &&
                            neighbor.source != "lens"
                              ? "ml-3 h-12  object-contain w-5"
                              : "w-12"
                          } rounded-xl`}
                          src={
                            neighbor.source === "lens"
                              ? "/lens.jpg"
                              : neighbor.source === "farcaster"
                              ? "/farcaster.jpg"
                              : "/eth.png"
                          }
                          alt=""
                        />
                      }
                      <h1 className="font-bold pl-1 mt-1 mb-3">
                        {neighbor.source[0].toUpperCase() +
                          neighbor.source.slice(1)}
                      </h1>
                      <p className=" ml-1 text-sm">{neighbor.displayName}</p>
                      <p className="text-muted ml-1 text-xs">
                        {neighbor.identity}
                      </p>
                    </div>
                  );
                }
              )}

            {!loading &&
              userData.neighbors &&
              userData.neighbors.length === 0 && (
                <p className="text-white mt-10 text-center w-full text-sm">
                  No social identities found
                </p>
              )}

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
        </div>
      </main>
      <Resume isMe={isMe} userAddress={params.address} />
    </div>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Web3Context } from "@/components/web3-provider";
import { TimeToken, Tutor } from "@/lib/types";
import { Contract } from "ethers";
import { Loader2Icon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { getMainContract } from "@/lib/contracts";
import {
  SismoConnectButton,
  AuthType,
  SismoConnectResponse,
  ClaimType,
} from "@sismo-core/sismo-connect-react";

export default function Profile() {
  const { signer, sismo, address, setSismo } = useContext(Web3Context);
  const [tutor, setTutor] = useState<Tutor>();
  const [tutorTimes, setTutorTimes] = useState<TimeToken[]>([]);
  const [earned, setEarned] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const { toast } = useToast();
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

  const getTutor = async () => {
    const tutorFromContract = await contract.addressToTutor(
      signer!.getAddress()
    );
    setTutor({
      name: tutorFromContract[0],
      title: tutorFromContract[1],
      tutorAddress: tutorFromContract[2],
      mintedAmount: tutorFromContract[3].toString(),
      maxMint: tutorFromContract[4].toString(),
      hourPrice: (tutorFromContract[5] / 10 ** 18).toString(),
      description: tutorFromContract[6],
    });
  };

  // approve
  const redeem = async (id: number) => {
    const tx = await contract.burn(id);
    await tx.wait();
    getTutorTimes();
  };

  const getTutorTimes = async () => {
    const tutorTimesFromContract = await contract.getAllTutorTimeForTutor(
      signer!.getAddress()
    );
    const formatted = tutorTimesFromContract.map((token: any) => {
      return {
        tokenId: token[0],
        tutor: token[1],
        student: token[2],
        price: (token[3] / 10 ** 18).toString(),
        mintedAt: token[4],
        redeemedAt: token[5],
      };
    });
    setTutorTimes(formatted);
    const earnedETH = formatted.reduce(
      (acc: number, curr: any) => acc + parseFloat(curr.price),
      0
    );
    setEarned(earnedETH);
  };

  useEffect(() => {
    if (signer) {
      setLoading(true);
      getTutorTimes();
      getTutor();
      setLoading(false);
    } else {
      router.push("/");
    }
  }, [router, signer, contract]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    // @ts-ignore
    setTutor({ ...tutor, [name!]: value });
  };

  const saveTutor = async () => {
    try {
      if (loadingSave) return;
      if (!tutor) return;
      if (!signer) return;
      if (
        !tutor.maxMint ||
        !tutor.title ||
        !tutor.description ||
        !tutor.hourPrice ||
        !tutor.name
      )
        return;
      setLoadingSave(true);
      const tx = await contract.setTutorPreferences(
        parseFloat(tutor!.maxMint),
        tutor!.hourPrice + "0".repeat(18),
        tutor!.name,
        tutor!.title,
        tutor!.description
      );
      toast({
        description: "Updating...",
      });
      await tx.wait();
      toast({
        description: "Your profile has been updated",
      });
      setLoadingSave(false);
    } catch (e) {
      console.log(e);
      toast({
        description: "Error updating your profile",
      });
      setLoadingSave(false);
    }
  };

  return (
    (sismo && (
      <div className="mx-16 flex flex-col mt-10 py-15 px-20 gap-10">
        <div className="flex gap-10">
          <main className="w-9/12 mx-auto p-10 px-20 bg-[#181c2a] rounded-xl shadow-sm flex flex-col justify-center items-start">
            <h1 className="text-4xl text-left  mb-2">Tell us what you do 💡</h1>
            <p className="text-md italic font-thin text-left">
              Let us know what you do and how much you charge per hour. Students
              will be able to find you and book a session with you by minting
              your TutorToken.
            </p>
            <div className="flex flex-col gap-5 mt-10 w-full">
              <div className="flex gap-10">
                <div className="w-6/12">
                  <p className="mb-1 font-light">
                    Your name has a{" "}
                    <span className="text-secondary">value</span>
                  </p>
                  {loading ? (
                    <Skeleton className="mb-2 w-full h-9" />
                  ) : (
                    <Input
                      value={tutor?.name}
                      onChange={handleInputChange}
                      placeholder="Name"
                      name="name"
                    />
                  )}
                </div>
                <div className="w-full">
                  <p className="mb-1 font-light">
                    What is your{" "}
                    <span className="text-secondary">expertise</span>
                  </p>
                  {loading ? (
                    <Skeleton className="mb-2 w-full h-9" />
                  ) : (
                    <Input
                      value={tutor?.title}
                      onChange={handleInputChange}
                      name="title"
                      placeholder="Title"
                    />
                  )}
                </div>
              </div>
              <div className="w-full">
                <p className="mb-1 font-light">
                  Describe <span className="text-secondary">what you do</span>
                </p>
                {loading ? (
                  <Skeleton className="mb-2 w-full h-9" />
                ) : (
                  <Textarea
                    value={tutor?.description}
                    onChange={handleInputChange}
                    name="description"
                    placeholder="Description"
                    className="h-10"
                  />
                )}
              </div>

              <div className="flex gap-10">
                <div className="w-full">
                  <p className="mb-1 font-light">
                    Hourly rate in <span className="text-secondary">USDC</span>
                  </p>
                  {loading ? (
                    <Skeleton className="mb-2 w-full h-9" />
                  ) : (
                    <Input
                      value={tutor?.hourPrice}
                      onChange={handleInputChange}
                      name="hourPrice"
                      placeholder="Hourly rate"
                    />
                  )}
                </div>
                <div className="w-full">
                  <p className="mb-1 font-light">
                    Supply of your{" "}
                    <span className="text-secondary">TutorTokens</span>
                  </p>
                  {loading ? (
                    <Skeleton className="mb-2 w-full h-9" />
                  ) : (
                    <Input
                      value={tutor?.maxMint}
                      onChange={handleInputChange}
                      name="maxMint"
                      placeholder="Max mint"
                    />
                  )}
                </div>
              </div>
            </div>
            <Button
              onClick={saveTutor}
              disabled={loadingSave}
              className="text-center bg-secondary w-32 px-10 py-2 mt-10 rounded-md text-white font-bold"
            >
              {loadingSave ? (
                <Loader2Icon className="animate-spin inline" />
              ) : (
                "Save"
              )}
            </Button>
          </main>
          <main className="w-3/12 p-10 bg-[#181c2a] rounded-xl shadow-sm flex flex-col items-center h-auto">
            <h1 className="text-2xl text-left mb-10 ">Your stats 📈</h1>

            <p className="mb-2">
              You <span className="text-secondary">sold</span>
            </p>
            {loading ? (
              <Skeleton className="mb-2  w-full h-10" />
            ) : (
              <h1 className="text-3xl font-bold">{tutor?.mintedAmount}</h1>
            )}
            <p className="mb-2 mt-7">
              You <span className="text-secondary">earned</span>
            </p>
            {loading ? (
              <Skeleton className="mb-2  w-full h-10" />
            ) : (
              <h1 className="text-3xl font-bold">{earned}</h1>
            )}
            <span className="text-secondary text-xs ">USDC</span>
          </main>
        </div>
        <div className="bg-[#181c2a] w-full rounded-xl  p-8">
          <h1 className="mb-3">Your TimeTokens minted by students</h1>
          <div className="flex gap-10">
            {!loading &&
              tutorTimes.length > 0 &&
              tutorTimes.map((timeToken, index) => {
                return (
                  <div
                    key={index}
                    className={`flex flex-col bg-white/10 w-52 p-3 rounded-xl ${
                      timeToken.redeemedAt ? "opacity-50" : ""
                    }}`}
                  >
                    <p className="text-sm font-light">
                      Value:{" "}
                      <span className="text-secondary">
                        {timeToken.price} USDC
                      </span>
                    </p>
                    <p className="text-xs font-light text-muted ">
                      Minted on<br></br>
                      {new Date(
                        parseFloat(timeToken.mintedAt.toString()) * 1000
                      ).toLocaleString()}
                    </p>
                    {timeToken.redeemedAt ? (
                      <p className="text-xs text-muted font-bold">
                        Redeemed at<br></br>
                        {new Date(
                          parseFloat(timeToken.redeemedAt.toString()) * 1000
                        ).toLocaleString()}
                      </p>
                    ) : (
                      <Badge
                        variant={"secondary"}
                        onClick={() => redeem(timeToken.tokenId * 1)}
                        className="mt-3 text-white cursor-pointer text-xs py-0.5 ml-auto w-fit"
                      >
                        Redeem
                      </Badge>
                    )}
                  </div>
                );
              })}{" "}
            {!loading && tutorTimes.length == 0 && (
              <p className="text-xs text-muted">
                No TimeTokens minted yet. <br></br>Students can mint your
                TimeTokens by visiting your profile page.
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
      </div>
    )) ||
    (!sismo && (
      <div className="flex justify-center mt-10">
        <SismoConnectButton
          text="Verify using Sismo before becoming a tutor"
          config={{
            appId: "0x1c00de936e8d97a97e892cfbb88e3a21",
          }}
          claims={[
            {
              groupId: "0x1cde61966decb8600dfd0749bd371f12",
              value: 9,
              claimType: ClaimType.GTE,
            },
          ]}
          signature={{
            message:
              "I sign this message to prove that I own this address: " +
              address,
          }}
          onResponse={async (response: SismoConnectResponse) => {
            setSismo!(true);
          }}
        />
      </div>
    ))
  );
}

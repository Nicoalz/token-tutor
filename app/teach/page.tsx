"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Web3Context } from "@/components/web3-provider";
import { Tutor } from "@/lib/types";
import { contracts } from "@/lib/utils";
import { Contract } from "ethers";
import { useContext, useEffect, useState } from "react";

export default function Profile() {
  const { signer } = useContext(Web3Context);
  const [tutor, setTutor] = useState<Tutor>();
  const [earned, setEarned] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const { toast } = useToast();

  const contract = new Contract(
    contracts.TutorTimeToken.address,
    contracts.TutorTimeToken.abi,
    signer
  );

  const getTutor = async () => {
    const tutorFromContract = await contract.addressToTutor(
      signer!.getAddress()
    );
    setTutor({
      name: tutorFromContract[0],
      description: tutorFromContract[1],
      tutorAddress: tutorFromContract[2],
      mintedAmount: tutorFromContract[3].toString(),
      maxMint: tutorFromContract[4].toString(),
      hourPrice: (tutorFromContract[5] / 10 ** 18).toString(),
    });
  };

  const getTutorTimes = async () => {
    const tutorTimesFromContract = await contract.getAllTutorTimeForTutor(
      signer!.getAddress()
    );
    const earnedETH = tutorTimesFromContract.reduce(
      (acc: number, curr: any) => acc + parseFloat(curr[1]),
      0
    );
    console.log(earnedETH);
    setEarned(earnedETH);
  };

  useEffect(() => {
    if (signer) {
      setLoading(true);
      getTutorTimes();
      getTutor();
      setLoading(false);
    }
  }, [signer]);

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
        !tutor.description ||
        !tutor.hourPrice ||
        !tutor.name
      )
        return;
      setLoadingSave(true);
      const tx = await contract.setTutorPreferences(
        parseFloat(tutor!.maxMint),
        (parseFloat(tutor!.hourPrice) * 10 ** 18).toString(),
        tutor!.name,
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
    <div className="mx-16 flex mt-10 py-15 px-20 gap-10">
      <main className="w-9/12 mx-auto p-10 px-20 bg-[#181c2a] rounded-xl shadow-sm flex flex-col justify-center items-start">
        <h1 className="text-4xl text-left  mb-2">Tell us what you do 💡</h1>
        <p className="text-md italic font-thin text-left">
          Let us know what you do and how much you charge per hour. Students
          will be able to find you and book a session with you by minting your
          TutorToken.
        </p>
        <div className="flex flex-col gap-5 mt-10 w-full">
          <div className="flex gap-10">
            <div className="w-6/12">
              <p className="mb-1 font-light">
                Your name has a <span className="text-secondary">value</span>
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
                What do you{" "}
                <span className="text-secondary">bring to the table</span>
              </p>
              {loading ? (
                <Skeleton className="mb-2 w-full h-9" />
              ) : (
                <Input
                  value={tutor?.description}
                  onChange={handleInputChange}
                  name="description"
                  placeholder="Description"
                />
              )}
            </div>
          </div>

          <div className="flex gap-10">
            <div className="w-full">
              <p className="mb-1 font-light">
                Hourly rate in <span className="text-secondary">ETH</span>
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
          className="bg-secondary w-32 px-10 py-2 mt-10 rounded-md text-white font-bold"
        >
          Save
        </Button>
      </main>
      <main className="w-3/12 p-10 bg-[#181c2a] rounded-xl shadow-sm flex flex-col items-center h-fit">
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
        <span className="text-secondary text-xs ">ETH</span>
      </main>
    </div>
  );
}

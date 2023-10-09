import { Input } from "@/components/ui/input";

export default function Profile() {
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
              <Input placeholder="Name" />
            </div>
            <div className="w-full">
              <p className="mb-1 font-light">
                What do you{" "}
                <span className="text-secondary">bring to the table</span>
              </p>
              <Input placeholder="Description" />
            </div>
          </div>

          <div className="flex gap-10">
            <div className="w-full">
              <p className="mb-1 font-light">
                Hourly rate in <span className="text-secondary">ETH</span>
              </p>
              <Input placeholder="Hourly rate" />
            </div>
            <div className="w-full">
              <p className="mb-1 font-light">
                Supply of your{" "}
                <span className="text-secondary">TutorTokens</span>
              </p>
              <Input placeholder="Max mint" />
            </div>
          </div>
        </div>
        <button className="bg-secondary w-32 px-10 py-2 mt-10 rounded-md text-white font-bold">
          Save
        </button>
      </main>
      <main className="w-3/12 p-10 bg-[#181c2a] rounded-xl shadow-sm flex flex-col items-center h-fit">
        <h1 className="text-2xl text-left mb-10 ">Your stats 📈</h1>
        <p className="mb-1">
          Your <span className="text-secondary">TutorToken</span> is worth
        </p>
        <h1 className="text-3xl font-bold mb-5">2 ETH</h1>
        <p className="mb-1">
          You <span className="text-secondary">sold</span>
        </p>
        <h1 className="text-3xl font-bold">54 </h1>
        <span className="text-secondary text-xs ">TutorTokens</span>
      </main>
    </div>
  );
}

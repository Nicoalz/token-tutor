import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import React, { useState, useReducer } from "react";
import { Web3Storage } from "web3.storage";
import { createClient } from "@supabase/supabase-js";
export default function Resume() {
  const [modalResumeOpen, setModalResumeOpen] = useState(false);
  const [messages, showMessage] = useReducer(
    (msgs: any, m: any) => msgs.concat(m),
    []
  );
  const [files, setFiles] = useState([]) as any[];

  const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!
  );

  function showLink(url: string) {
    showMessage(
      <span>
        &gt; 🔗 <a href={url}>{url}</a>
      </span>
    );
  }

  async function handleSubmit(event: any) {
    // don't reload the page!
    event.preventDefault();

    showMessage("> 📦 creating web3.storage client");
    const client = new Web3Storage({
      token: process.env.NEXT_PUBLIC_WEB_STORAGE_KEY,
    });

    showMessage(
      "> 🤖 chunking and hashing the files (in your browser!) to calculate the Content ID"
    );
    const cid = await client.put(files, {
      onRootCidReady: (localCid: string) => {
        showMessage(`> 🔑 locally calculated Content ID: ${localCid} `);
        showMessage("> 📡 sending files to web3.storage ");
      },
      onStoredChunk: (bytes: number) =>
        showMessage(`> 🛰 sent ${bytes.toLocaleString()} bytes to web3.storage`),
    });
    showMessage(`> ✅ web3.storage now hosting ${cid}`);
    showLink(`https://dweb.link/ipfs/${cid}`);

    showMessage("> 📡 fetching the list of all unique uploads on this account");
    let totalBytes = 0;
    for await (const upload of client.list()) {
      showMessage(`> 📄 ${upload.cid}  ${upload.name}`);
      totalBytes += upload.dagSize || 0;
    }
    showMessage(`> ⁂ ${totalBytes.toLocaleString()} bytes stored!`);
  }

  const resumeURL =
    "https://bafybeickuofa2qtign46hspdxuqtcl66in5qnvzr64q374rqq3w3zswwqi.ipfs.dweb.link/resume_sample_page-0001.jpg";
  return (
    <main className="flex-col w-3/12 py-10 px-6 bg-[#181c2a] rounded-xl shadow-sm flex min-h-[32rem] items-center">
      <h2 className="text-3xl mb-4">Resume 📄</h2>
      <Image
        className="cursor-pointer"
        onClick={() => setModalResumeOpen(true)}
        src={resumeURL}
        alt="resume"
        width={250}
        height={150}
      />
      {/* <Button
        onClick={saveTutor}
        disabled={loadingSave}
        className="text-center bg-secondary w-32 px-10 py-2 mt-10 rounded-md text-white font-bold"
      >
        {loadingSave ? <Loader2Icon className="animate-spin inline" /> : "Save"}
      </Button> */}
      <form
        className=" w-full mt-2"
        id="upload-form"
        onSubmit={handleSubmit}
      >
        <input
          type="file"
          id="filepicker"
          name="fileList"
          onChange={(e) => setFiles(e.target.files)}
          required
          style={{ width: "100%", height: "30px" }} // Adjust width and height as needed
        />

        <Button
          className="text-center bg-secondary w-32 px-10 py-2 mt-10 rounded-md text-white font-bold"
          type="submit"
          value="Submit"
          id="submit"
        >
          Change
        </Button>
      </form>
      {modalResumeOpen && (
        <div
          onClick={() => setModalResumeOpen(false)}
          className="cursor-pointer absolute w-full h-full top-0 left-0 bg-black/50 flex justify-center items-center"
        >
          <Image src={resumeURL} alt="resume" width={500} height={800} />
        </div>
      )}
    </main>
  );
}

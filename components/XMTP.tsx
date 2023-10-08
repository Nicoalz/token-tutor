import { useClient } from "@xmtp/react-sdk";
import { useCallback } from "react";
import { useEffect, useContext, useState } from "react";
import { Web3Context } from "./web3-provider";
import ConversationsXMTP from "./ConversationsXMTP";
export default function XMTP() {
  const [isXmtpOpen, setIsXmtpOpen] = useState(false);
  const {
    client,
    error: errorClient,
    isLoading: isLoadingClient,
    initialize,
  } = useClient();
  const { signer } = useContext(Web3Context);

  const handleConnect = useCallback(async () => {
    const options = {
      persistConversations: true,
      env: "production",
    };
    await initialize({ signer });
  }, [initialize, signer]);

  useEffect(() => {
    console.log({ client });
  }, [client]);

  return (
    <div className="">
      {isXmtpOpen && (
        <div className="absolute bg-black/40 rounded-xl shadow-sm bottom-2 right-2 flex flex-col justify-start items-center w-96 h-[32rem] p-2 ">
          {errorClient && (
            <p>An error occurred while initializing the client</p>
          )}
          {isLoadingClient && <p>Awaiting signatures...</p>}
          {!isLoadingClient && !errorClient && !client && (
            <button type="button" onClick={handleConnect}>
              Connect to XMTP
            </button>
          )}
          {client && (
            <div>
              <p>Connected to XMTP</p>
            </div>
          )}

          <ConversationsXMTP />
        </div>
      )}
      <button className="absolute bottom-2 right-2 ">
        <img
          onClick={() => setIsXmtpOpen(!isXmtpOpen)}
          src="/xmtp-logo.png"
          className="cursor-pointer rounded-bl-[50%] rounded-tl-[50%] rounded-tr-[50%]"
          alt="Token Tutor"
          width={60}
          height={60}
        />
      </button>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { MessageContainer } from "./MessageContainer";
import { useCanMessage, Client } from "@xmtp/react-sdk";
import { ListConversations } from "./ListConversations";
import { ethers } from "ethers";
import { NewConversation } from "./NewConversation";

export const ConversationContainer = ({
  client,
  selectedConversation,
  setSelectedConversation,
  isPWA = false,
}: {
  client: Client;
  selectedConversation: any;
  setSelectedConversation: any;
  isPWA?: boolean;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [peerAddress, setPeerAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingResolve, setLoadingResolve] = useState(false);
  const { canMessage } = useCanMessage();
  const [createNew, setCreateNew] = useState(false);
  const [conversationFound, setConversationFound] = useState(false);

  const styles = {
    conversations: {
      height: "100%",
      fontSize: isPWA == true ? "1.2em" : ".9em", // Increased font size
    },
    conversationList: {
      //overflowY: "auto",
      padding: "0px",
      margin: "0",
      listStyle: "none",
      overflowY: "scroll",
      backgroundColor: "#181C2A",
    },
    smallLabel: {
      fontSize: isPWA == true ? "1.5em" : ".9em", // Increased font size
    },
    createNewButton: {
      border: "1px",
      padding: "5px",
      borderRadius: "5px",
      marginTop: "10px",
      fontSize: isPWA == true ? "1.2em" : ".9em", // Increased font size
    },
    peerAddressInput: {
      width: "100%",
      padding: "10px",
      boxSizing: "border-box",
      border: "0px solid #ccc",
      fontSize: isPWA == true ? "1.2em" : ".9em", // Increased font size
      backgroundColor: "#090B20",
    },
  };
  const isValidEthereumAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSearchChange = async (e: any) => {
    setCreateNew(false);
    setConversationFound(false);
    setSearchTerm(e.target.value);
    console.log("handleSearchChange", e.target.value);
    setMessage("Searching...");
    const addressInput = e.target.value;
    const isEthDomain = /\.eth$/.test(addressInput);
    let resolvedAddress = addressInput;
    if (isEthDomain) {
      setLoadingResolve(true);
      try {
        const provider = new ethers.providers.CloudflareProvider();
        resolvedAddress = await provider.resolveName(resolvedAddress);
      } catch (error) {
        console.log(error);
        setMessage("Error resolving address");
        setCreateNew(false);
      } finally {
        setLoadingResolve(false);
      }
    }
    console.log("resolvedAddress", resolvedAddress);
    if (resolvedAddress && isValidEthereumAddress(resolvedAddress)) {
      processEthereumAddress(resolvedAddress);
      setSearchTerm(resolvedAddress); // <-- Add this line
    } else {
      setMessage("Invalid Ethereum address");
      setPeerAddress("");
      setCreateNew(false);
      //setCanMessage(false);
    }
  };

  const processEthereumAddress = async (address: string) => {
    setPeerAddress(address);
    if (address === client.address) {
      setMessage("No self messaging allowed");
      setCreateNew(false);
      // setCanMessage(false);
    } else {
      const canMessageStatus = await client?.canMessage(address);
      if (canMessageStatus) {
        setPeerAddress(address);
        // setCanMessage(true);
        setMessage("Address is on the network ✅");
        setCreateNew(true);
      } else {
        //  setCanMessage(false);
        setMessage("Address is not on the network ❌");
        setCreateNew(false);
      }
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div style={styles.conversations}>
      {!selectedConversation && (
        <ul style={styles.conversationList as React.CSSProperties}>
          <input
            type="text"
            placeholder="Enter a 0x wallet, ENS, or UNS address"
            value={searchTerm}
            onChange={handleSearchChange}
            style={styles.peerAddressInput as React.CSSProperties}
          />
          {loadingResolve && searchTerm && <small>Resolving address...</small>}
          <ListConversations
            isPWA={isPWA}
            searchTerm={searchTerm}
            selectConversation={setSelectedConversation}
            client={client}
            onConversationFound={(state: any) => {
              setConversationFound(state);
              if (state == true) setCreateNew(false);
            }}
          />
          {/*&&
            (await canMessage(peerAddress)) */}
          {message && conversationFound !== true && <small>{message}</small>}
          {peerAddress && createNew && (
            <>
              {message && <small>{message}</small>}
              <button
                style={styles.createNewButton}
                onClick={() => {
                  setSelectedConversation({ messages: [] });
                }}
              >
                Create new conversation
              </button>
            </>
          )}
        </ul>
      )}
      {selectedConversation && (
        <>
          {selectedConversation.id ? (
            <MessageContainer
              isPWA={isPWA}
              client={client}
              conversation={selectedConversation}
            />
          ) : (
            <NewConversation
              selectConversation={setSelectedConversation}
              peerAddress={peerAddress}
            />
          )}
        </>
      )}
    </div>
  );
};

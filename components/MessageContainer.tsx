import React, { useState, useCallback, useRef, useEffect } from "react";
import { MessageInput } from "./MessageInput";
import {
  useMessages,
  useSendMessage,
  useStreamMessages,
  Client,
} from "@xmtp/react-sdk";
import MessageItem from "./MessageItem";

const styles = {
  messagesContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  messagesList: {
    paddingLeft: "10px",
    paddingRight: "10px",
    margin: "0px",
    alignItems: "flex-start",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
};

export const MessageContainer = ({
  conversation,
  client,
}: {
  conversation: any;
  client: Client;
}) => {
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const { messages } = useMessages(conversation);
  const [streamedMessages, setStreamedMessages] = useState<any[]>([]);

  const onMessage = useCallback(
    (message: any) => {
      setStreamedMessages((prev: any[]) => [...prev, message]);
    },
    [streamedMessages]
  );

  useStreamMessages(conversation, { onMessage });
  const { sendMessage } = useSendMessage();

  useEffect(() => {
    setStreamedMessages([]);
  }, [conversation]);

  const handleSendMessage = async (newMessage: any) => {
    if (!newMessage.trim()) {
      alert("empty message");
      return;
    }
    if (conversation && conversation.peerAddress) {
      await sendMessage(conversation, newMessage);
    }
  };

  useEffect(() => {
    (messagesEndRef.current as any)?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={styles.messagesContainer as React.CSSProperties}>
      {isLoading ? (
        <small className="loading">Loading messages...</small>
      ) : (
        <>
          <ul style={styles.messagesList as React.CSSProperties}>
            {messages.slice().map((message) => {
              return (
                <MessageItem
                  key={message.id}
                  message={message}
                  senderAddress={message.senderAddress}
                  client={client}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </ul>
          <MessageInput
            onSendMessage={(msg: any) => {
              handleSendMessage(msg);
            }}
          />
        </>
      )}
    </div>
  );
};

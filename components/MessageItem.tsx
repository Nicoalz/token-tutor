import React from "react";
import { Client } from "@xmtp/react-sdk";

const MessageItem = ({
  message,
  senderAddress,
  client,
  isPWA = false,
}: {
  message: any;
  senderAddress: any;
  client: Client;
  isPWA?: boolean;
}) => {
  const styles = {
    messageContent: {
      backgroundColor: "lightblue",
      padding: isPWA == true ? "10px 20px" : "5px 10px",
      alignSelf: "flex-start",
      textAlign: "left",
      display: "inline-block",
      margin: isPWA == true ? "10px" : "5px",
      borderRadius: isPWA == true ? "10px" : "5px",
      maxWidth: "80%",
      wordBreak: "break-word",
      cursor: "pointer",
      listStyle: "none",
    },
    renderedMessage: {
      fontSize: isPWA == true ? "16px" : "12px",
      wordBreak: "break-word",
      padding: "0px",
    },
    senderMessage: {
      alignSelf: "flex-start",
      textAlign: "left",
      listStyle: "none",
      width: "100%",
    },
    receiverMessage: {
      alignSelf: "flex-end",
      listStyle: "none",
      textAlign: "right",
      width: "100%",
    },
    footer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    timeStamp: {
      fontSize: isPWA == true ? "12px" : "8px",
      color: "grey",
    },
  };

  const renderMessage = (message: any) => {
    try {
      if (message?.content.length > 0) {
        return (
          <div style={styles.renderedMessage as React.CSSProperties}>
            {message?.content}
          </div>
        );
      }
    } catch {
      return message?.fallbackContent ? (
        message?.fallbackContent
      ) : message?.contentFallback ? (
        message?.contentFallback
      ) : (
        <div style={styles.renderedMessage as React.CSSProperties}>
          {message?.content}
        </div>
      );
    }
  };

  const isSender = senderAddress === client?.address;

  return (
    <li
      style={
        isSender
          ? (styles.receiverMessage as React.CSSProperties)
          : (styles.senderMessage as React.CSSProperties)
      }
      key={message.id}
    >
      <div style={styles.messageContent as React.CSSProperties}>
        {renderMessage(message)}
        <div style={styles.footer}>
          <span style={styles.timeStamp}>
            {`${new Date(message.sentAt).getHours()}:${String(
              new Date(message.sentAt).getMinutes()
            ).padStart(2, "0")}`}
          </span>
        </div>
      </div>
    </li>
  );
};
export default MessageItem;

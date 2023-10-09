import React from "react";
import { Client } from "@xmtp/react-sdk";
const styles = {
  messageContent: {
    backgroundColor: "lightblue",
    padding: "5px 10px",
    alignSelf: "flex-start",
    textAlign: "left",
    display: "inline-block",
    margin: "5px",
    borderRadius: "5px",
    maxWidth: "80%",
    wordBreak: "break-word",
    cursor: "pointer",
    listStyle: "none",
  },
  renderedMessage: {
    fontSize: "12px",
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
    fontSize: "8px",
    color: "grey",
  },
};

const MessageItem = ({
  message,
  senderAddress,
  client,
}: {
  message: any;
  senderAddress: any;
  client: Client;
}) => {
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

  const MessageComponent = isSender ? "li" : "li";

  return (
    <MessageComponent
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
    </MessageComponent>
  );
};
export default MessageItem;

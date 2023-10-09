import React, { useState } from "react";

export const MessageInput = ({
  onSendMessage,
  //replyingToMessage,
  isPWA = false,
}: {
  onSendMessage: any;
  //replyingToMessage: any;
  isPWA?: boolean;
}) => {
  const [newMessage, setNewMessage] = useState("");

  const handleInputChange = (event: any) => {
    if (event.key === "Enter") {
      onSendMessage(newMessage);
      setNewMessage("");
    } else {
      setNewMessage(event.target.value);
    }
  };

  const styles = {
    newMessageContainer: {
      display: "flex",
      alignItems: "center",
      paddingLeft: "10px",
      paddingRight: "10px",
      flexWrap: "wrap",
    },
    messageInputField: {
      flexGrow: 1,
      padding: "5px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      fontSize: isPWA == true ? "1.2em" : ".9em", // Increased font size
    },
    sendButton: {
      padding: "5px 10px",
      marginLeft: "5px",
      border: "1px solid #ccc",
      cursor: "pointer",
      borderRadius: "5px",
      display: "flex",
      alignItems: "center",
      textAlign: "center",
      fontSize: isPWA == true ? "1.2em" : ".9em", // Increased font size
    },
  };

  return (
    <div style={styles.newMessageContainer as React.CSSProperties}>
      <input
        style={styles.messageInputField}
        type="text"
        value={newMessage}
        onKeyPress={handleInputChange}
        onChange={handleInputChange}
        placeholder="Type your message..."
      />
      <button
        style={styles.sendButton as React.CSSProperties}
        onClick={() => {
          onSendMessage(newMessage);
          setNewMessage("");
        }}
      >
        Send
      </button>
    </div>
  );
};

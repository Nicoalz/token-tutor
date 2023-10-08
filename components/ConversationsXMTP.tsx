import { useConversations } from "@xmtp/react-sdk";

export default function ConversationsXMTP() {
  const {
    conversations,
    error: errorConversations,
    isLoading: isLoadingConversations,
  } = useConversations();

  return (
    <div>
      {errorConversations && (
        <p>An error occurred while fetching conversations</p>
      )}

      {isLoadingConversations && <p>Loading conversations...</p>}

      <div className="flex flex-col justify-start items-center w-full h-full overflow-y-scroll">
        {conversations.map((conversation) => {
          return (
            <div
              className="flex flex-col justify-start items-center w-full h-20 bg-white/20 rounded-xl mb-2"
              key={conversation.id}
            >
              <p className="text-white">{conversation.peerAddress}</p>
              <p className="text-white">{conversation.id}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

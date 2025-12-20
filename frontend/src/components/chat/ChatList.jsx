import { useChat } from "../../context/ChatContext";
import ChatItem from "./ChatItem";

const ChatList = () => {
  const { chats, selectedChat, setSelectedChat } = useChat();

  // 🛡️ HARD GUARD
  if (!Array.isArray(chats)) return null;
 
  const sortedChats = [...chats].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.length === 0 && (
        <p className="text-center mt-4 text-gray-400">No chats yet</p>
      )}

      {sortedChats.map((chat) => (
        <ChatItem
          key={chat._id}
          chat={chat}
          isActive={selectedChat?._id === chat._id}
          onClick={() => setSelectedChat(chat)}
        />
      ))}
    </div>
  );
};

export default ChatList;

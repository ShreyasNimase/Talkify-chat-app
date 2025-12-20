import { useChat } from "../../context/ChatContext";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatWindow = () => {
  const { selectedChat } = useChat();

  if (!selectedChat) {
    return (
      <div className="w-[70%] flex items-center justify-center text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  // useEffect(() => {
  //   if (!selectedChat) return;

  //   // Re-fetch chats when switching chats
  //   fetchChats().then(setChats);
  // }, [selectedChat]);

  return (
    <div
      className="
        hidden md:flex
        w-full md:w-[65%] lg:w-[70%]
        flex-col bg-gray-50
      "
    >
      <ChatHeader chat={selectedChat} />
      <MessageList chatId={selectedChat._id} />
      <MessageInput chatId={selectedChat._id} />
    </div>
  );
};

export default ChatWindow;

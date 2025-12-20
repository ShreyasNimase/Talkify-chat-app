import { useEffect } from "react";
import { socket } from "../../socket";
import { useChat } from "../../context/ChatContext";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatWindow = () => {
  const { selectedChat } = useChat();

  // Join chat room when chat is selected
  useEffect(() => {
    if (selectedChat?._id) {
      socket.emit("join chat", selectedChat._id);
    }
  }, [selectedChat?._id]);

  if (!selectedChat) {
    return (
      <div className="w-[70%] flex items-center justify-center text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="hidden md:flex w-full md:w-[65%] lg:w-[70%] flex-col bg-gray-50">
      {/*  Presence handled INSIDE ChatHeader */}
      <ChatHeader chat={selectedChat} />

      {/* Messages + typing handled here */}
      <MessageList chatId={selectedChat._id} />

      {/* Sending + typing emit handled here */}
      <MessageInput chatId={selectedChat._id} />
    </div>
  );
};

export default ChatWindow;

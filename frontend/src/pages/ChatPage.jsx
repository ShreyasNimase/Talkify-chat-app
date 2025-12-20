import { useEffect } from "react";
import { fetchChats } from "../api/chatApi";
import { useChat } from "../context/ChatContext";
import Sidebar from "../components/chat/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";

function ChatPage() {
  const { setChats } = useChat();

  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await fetchChats();
        setChats(data);
      } catch (err) {
        console.error("Failed to load chats", err);
      }
    };

    loadChats();

    // Poll every 5 seconds (receiver sync)
    const interval = setInterval(loadChats, 5000);

    return () =>clearInterval(interval);
  }, [setChats]);

  return (
    <div className="h-screen w-full flex bg-gray-100 overflow-hidden">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}

export default ChatPage;

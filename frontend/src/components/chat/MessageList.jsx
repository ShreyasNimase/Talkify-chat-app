import { useEffect, useRef, useState } from "react";
import { fetchMessages } from "../../api/messageApi";
import MessageBubble from "./MessageBubble";
import { useChat } from "../../context/ChatContext";

const MessageList = ({ chatId }) => {
  const { messagesMap, setMessagesMap } = useChat();
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const messages = messagesMap[chatId] || [];

  useEffect(() => {
    if (!chatId || messages.length) return;

    const loadMessages = async () => {
      try {
        setLoading(true);
        const data = await fetchMessages(chatId);
        setMessagesMap((prev) => ({ ...prev, [chatId]: data }));
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Loading messages...
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        No messages yet. Start the conversation 👋
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
      {messages.map((msg) => (
        <MessageBubble key={msg._id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;

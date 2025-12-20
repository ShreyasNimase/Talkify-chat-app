import { useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import { fetchMessages } from "../../api/messageApi";
import MessageBubble from "./MessageBubble";
import { useChat } from "../../context/ChatContext";
import { getUser } from "../../utils/auth";

const MessageList = ({ chatId }) => {
  const { messagesMap, setMessagesMap } = useChat();
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);
  const user = getUser();

  const messages = messagesMap[chatId] || [];

  //  Load messages when chat opens
  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      const data = await fetchMessages(chatId);
      setMessagesMap((prev) => ({
        ...prev,
        [chatId]: data,
      }));
    };

    loadMessages();
    setIsTyping(false); // reset typing on chat switch
  }, [chatId, setMessagesMap]);

  // Receive new messages via socket
  useEffect(() => {
    const handleMessage = (newMessage) => {
      if (newMessage.sender._id === user._id) return;

      if (newMessage.chat._id === chatId) {
        setMessagesMap((prev) => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), newMessage],
        }));
      }
    };

    socket.on("message received", handleMessage);
    return () => socket.off("message received", handleMessage);
  }, [chatId, setMessagesMap, user._id]);

  // Typing indicator (CHAT-SCOPED)
  useEffect(() => {
    const handleTyping = (typingChatId) => {
      if (typingChatId === chatId) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = (typingChatId) => {
      if (typingChatId === chatId) {
        setIsTyping(false);
      }
    };

    socket.on("typing", handleTyping);
    socket.on("stop typing", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop typing", handleStopTyping);
    };
  }, [chatId]);

  //  Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
      {isTyping && (
        <p className="text-sm text-gray-400 mb-2 italic">Typing...</p>
      )}

      {messages.map((msg) => (
        <MessageBubble key={msg._id} message={msg} />
      ))}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;

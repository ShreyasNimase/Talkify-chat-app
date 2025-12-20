import { useState, useRef } from "react";
import { sendMessage } from "../../api/messageApi";
import { getUser } from "../../utils/auth";
import { useChat } from "../../context/ChatContext";
import { socket } from "../../socket";

const MessageInput = ({ chatId }) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const typingTimeoutRef = useRef(null);

  const { setMessagesMap, setChats } = useChat();
  const user = getUser();

  const handleSend = async (e) => {
    e.preventDefault();

    if (!text.trim() || !chatId || sending || !user) return;

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      content: text,
      sender: { _id: user._id, name: user.name, pic: user.pic },
      chat: chatId,
      createdAt: new Date().toISOString(),
      __optimistic: true,
    };

    // Optimistic UI
    setMessagesMap((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), optimisticMessage],
    }));

    setChats((prev) =>
      prev.map((c) =>
        c._id === chatId
          ? {
              ...c,
              latestMessage: {
                content: text,
                sender: { _id: user._id },
              },
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );

    setText("");
    setSending(true);

    try {
      const savedMessage = await sendMessage(chatId, text);

      setMessagesMap((prev) => ({
        ...prev,
        [chatId]: prev[chatId].map((m) =>
          m._id === tempId ? savedMessage : m
        ),
      }));

      setChats((prev) =>
        prev.map((c) =>
          c._id === chatId
            ? {
                ...c,
                latestMessage: savedMessage,
                updatedAt: savedMessage.createdAt,
              }
            : c
        )
      );

      // stop typing immediately on send
      socket.emit("stop typing", chatId);
    } catch (error) {
      console.error("Message send failed:", error);

      setMessagesMap((prev) => ({
        ...prev,
        [chatId]: prev[chatId].filter((m) => m._id !== tempId),
      }));
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (e) => {
    setText(e.target.value);

    socket.emit("typing", chatId);

    // reset timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop typing", chatId);
    }, 1000);
  };

  return (
    <form
      onSubmit={handleSend}
      className="flex items-center gap-3 px-4 py-3 bg-white border-t"
    >
      <input
        type="text"
        placeholder="Type a message"
        value={text}
        onChange={handleTyping}
        className="flex-1 px-4 py-2 rounded-lg bg-gray-100 outline-none"
      />

      <button
        type="submit"
        disabled={sending}
        className="bg-green-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg"
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;

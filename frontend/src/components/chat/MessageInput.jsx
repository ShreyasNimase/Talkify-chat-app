import { useState } from "react";
import { sendMessage } from "../../api/messageApi";
import { getUser } from "../../utils/auth";
import { useChat } from "../../context/ChatContext";

const MessageInput = ({ chatId }) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const { setMessagesMap, setChats } = useChat();
  const user = getUser();

  const handleSend = async (e) => {
    e.preventDefault();

    // 🛡️ Safety checks
    if (!text.trim() || !chatId || sending || !user) return;

    const tempId = `temp-${Date.now()}`;

    // 🔥 OPTIMISTIC MESSAGE (shown immediately)
    const optimisticMessage = {
      _id: tempId,
      content: text,
      sender: { _id: user._id, name: user.name, pic: user.pic },
      chat: chatId,
      createdAt: new Date().toISOString(),
      __optimistic: true,
    };

    // Optimistically add message to UI
    setMessagesMap((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), optimisticMessage],
    }));

    // Optimistically update chat list preview
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
      // API call to save message
      const savedMessage = await sendMessage(chatId, text);

      // Replace optimistic message with real one
      setMessagesMap((prev) => ({
        ...prev,
        [chatId]: prev[chatId].map((m) =>
          m._id === tempId ? savedMessage : m
        ),
      }));

      // Sync latestMessage with backend response
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
    } catch (error) {
      console.error("Message send failed:", error);

      // Rollback optimistic message on failure
      setMessagesMap((prev) => ({
        ...prev,
        [chatId]: prev[chatId].filter((m) => m._id !== tempId),
      }));
    } finally {
      setSending(false);
    }
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
        onChange={(e) => setText(e.target.value)}
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

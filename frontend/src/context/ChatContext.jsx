import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(() => {
    const saved = localStorage.getItem("selectedChat");
    return saved ? JSON.parse(saved) : null;
  });
  // messages keyed by chatId
  const [messagesMap, setMessagesMap] = useState({});

  // Persist selected chat
  useEffect(() => {
    if (selectedChat) {
      localStorage.setItem("selectedChat", JSON.stringify(selectedChat));
    }
  }, [selectedChat]);
  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        messagesMap,
        setMessagesMap,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);

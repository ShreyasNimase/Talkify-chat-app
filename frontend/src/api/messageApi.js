import api from "./axios";

// GET messages for a chat
export const fetchMessages = async (chatId) => {
  const { data } = await api.get(`/api/message/${chatId}`);
  return data;
};

// SEND a new message
export const sendMessage = async (chatId, content) => {
  const { data } = await api.post("/api/message", { chatId, content });
  return data;
};

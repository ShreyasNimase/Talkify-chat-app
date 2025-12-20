import api from "./axios";

export const accessChat = async (userId) => {
  const { data } = await api.post("/api/chat", { userId });
  return data;
};

export const fetchChats = async () => {
  const { data } = await api.get("/api/chat");
  return data;
};

const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");

// Create or Fetch 1-to-1 Chat
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error("UserId is required");
  }

  let chat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [req.user._id, userId] },
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (chat) return res.status(200).json(chat);

  const newChat = await Chat.create({
    chatName: "sender",
    users: [req.user._id, userId],
  });

  const fullChat = await Chat.findById(newChat._id).populate(
    "users",
    "-password"
  );

  res.status(201).json(fullChat);
});

// Fetch chats for sidebar
const fetchChats = asyncHandler(async (req, res) => {
   if (!req.user) {
     res.status(401);
     throw new Error("Unauthorized");
   }
  
  const chats = await Chat.find({
    users: { $in: [req.user._id] },
  })
    .populate("users", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "name pic email",
      },
    })
    .sort({ updatedAt: -1 });

  res.status(200).json(chats);
});

module.exports = { accessChat, fetchChats };

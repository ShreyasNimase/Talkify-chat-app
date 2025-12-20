const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");

// Send Message
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  let message = await Message.create({
    sender: req.user._id,
    content,
    chat: chatId,
  });

  message = await message.populate("sender", "name pic");
  message = await message.populate("chat");

  await Chat.findByIdAndUpdate(chatId, {
    latestMessage: message._id,
  });

  // SOCKET EVENT
  const io = req.app.get("io");
  io.to(chatId).emit("message received", message);

  res.status(201).json(message);
});

// Get Messages of Chat
const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    chat: req.params.chatId,
  })
    .populate("sender", "name pic")
    .sort({ createdAt: 1 });

  res.status(200).json(messages);
});

module.exports = { sendMessage, getMessages };

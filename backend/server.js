require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

connectDB();

const app = express();
const server = http.createServer(app);

// SOCKET SERVER
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// make io available in controllers
app.set("io", io);

const onlineUsers = new Map();

// socket events
io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  socket.on("setup", (userId) => {
    onlineUsers.set(userId, socket.id);
    // io.emit("user online", userId);
    // notify others
    socket.broadcast.emit("user online", userId);

    // 🔥 send current online users to THIS user
    socket.emit("online users", Array.from(onlineUsers.keys()));
  });

  socket.on("join chat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("typing", (chatId) => {
    socket.to(chatId).emit("typing");
  });

  socket.on("stop typing", (chatId) => {
    socket.to(chatId).emit("stop typing");
  });


  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        io.emit("user offline", userId);
      }
    }
  });
});


// middlewares
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// errors
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

import { useEffect, useState } from "react";
import { socket } from "../../socket";
import { getUser } from "../../utils/auth";

const ChatHeader = ({ chat }) => {
  const loggedUser = getUser();

  // Hooks must be FIRST (no conditions before this)
  const [online, setOnline] = useState(false);

  // Safely derive receiver using optional chaining
  const receiver = chat?.users?.find((u) => u._id !== loggedUser?._id);

  // Socket listeners
  useEffect(() => {
    if (!receiver?._id) return;

    const handleOnlineUsers = (users) => {
      setOnline(users.includes(receiver._id));
    };

    const handleUserOnline = (userId) => {
      if (userId === receiver._id) setOnline(true);
    };

    const handleUserOffline = (userId) => {
      if (userId === receiver._id) setOnline(false);
    };

    socket.on("online users", handleOnlineUsers);
    socket.on("user online", handleUserOnline);
    socket.on("user offline", handleUserOffline);

    return () => {
      socket.off("online users", handleOnlineUsers);
      socket.off("user online", handleUserOnline);
      socket.off("user offline", handleUserOffline);
    };
  }, [receiver?._id]);

  // Guards AFTER hooks
  if (!chat || !chat.users || !loggedUser || !receiver) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white border-b">
      <img
        src={receiver.pic}
        className="w-10 h-10 rounded-full object-cover"
        alt="receiver"
      />

      <div className="flex flex-col">
        <p className="font-semibold">{receiver.name}</p>
        <span
          className={`text-xs ${online ? "text-green-500" : "text-gray-400"}`}
        >
          {online ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  );
};

export default ChatHeader;

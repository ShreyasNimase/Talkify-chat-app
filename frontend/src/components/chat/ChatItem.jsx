import { getUser } from "../../utils/auth";

const ChatItem = ({ chat, isActive, onClick }) => {
  const loggedUser = getUser();

  if (!chat || !chat.users || !loggedUser) return null;

  const receiver = chat.users.find((u) => u._id !== loggedUser._id);

  if (!receiver) return null;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer
        ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`}
    >
      <img
        src={receiver.pic}
        alt="receiver"
        className="w-10 h-10 rounded-full object-cover"
      />

      <div className="flex-1">
        <p className="font-medium">{receiver.name}</p>
        <p className="text-sm text-gray-500 truncate">
          {chat.latestMessage?.content || "Start a conversation"}
        </p>
      </div>
    </div>
  );
};

export default ChatItem;

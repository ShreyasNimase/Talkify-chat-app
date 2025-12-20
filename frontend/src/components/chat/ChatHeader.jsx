import { getUser } from "../../utils/auth";

const ChatHeader = ({ chat }) => {
  const loggedUser = getUser();

  // Safety guard
  if (!chat || !chat.users || !loggedUser) return null;

  // Get the other user (receiver)
  const receiver = chat.users.find((u) => u._id !== loggedUser._id);

  if (!receiver) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white border-b">
      <img
        src={receiver.pic}
        className="w-10 h-10 rounded-full object-cover"
        alt="receiver"
      />

      <div className="flex flex-col">
        <p className="font-semibold">{receiver.name}</p>

        {/* Placeholder for future real-time status */}
        <span className="text-xs text-gray-400">online</span>
      </div>
    </div>
  );
};

export default ChatHeader;

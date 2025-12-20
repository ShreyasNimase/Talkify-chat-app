import { getUser } from "../../utils/auth";

const MessageBubble = ({ message }) => {
  const loggedUser = getUser();
  const isOwn = message.sender?._id === loggedUser?._id;

  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`max-w-[70%] px-4 py-2 rounded-lg text-sm
        ${isOwn ? "bg-green-200 ml-auto text-right" : "bg-white mr-auto"}
      `}
    >
      <p>{message.content}</p>
      <span className="text-[10px] text-gray-500 mt-1 block">{time}</span>
    </div>
  );
};

export default MessageBubble;

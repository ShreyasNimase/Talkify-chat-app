import { getUser } from "../../utils/auth";

const MessageBubble = ({ message }) => {
  const loggedUser = getUser();

  const isOwn = message.sender?._id === loggedUser?._id;

  return (
    <div
      className={`max-w-[70%] px-4 py-2 rounded-lg text-sm
        ${isOwn ? "bg-green-200 ml-auto text-right" : "bg-white mr-auto"}
      `}
    >
      {message.content}
    </div>
  );
};

export default MessageBubble;

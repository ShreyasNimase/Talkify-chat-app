import UserHeader from "./UserHeader";
import SearchBox from "./SearchBox";
import ChatList from "./ChatList";

const Sidebar = () => {
  return (
    <div
      className="
        w-full md:w-[35%] lg:w-[30%]
        bg-white border-r
        flex flex-col
      "
    >
      <UserHeader />
      <SearchBox />
      <ChatList />
    </div>
  );
};

export default Sidebar;

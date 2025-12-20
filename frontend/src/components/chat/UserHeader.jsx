import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../api/axios";

const UserHeader = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const handleLogout = async () => {
    try {
      // Clear refresh token cookie
      await api.post("/api/user/logout");

      // Clear access token
      localStorage.removeItem("userInfo");
      localStorage.removeItem("selectedChat");

      toast.success("Logged out successfully");

      navigate("/auth/login", { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b">
      <div className="flex items-center gap-3">
        <img
          src={user.pic}
          className="w-10 h-10 rounded-full object-cover"
          alt="profile"
        />
        <p className="font-semibold">{user.name}</p>
      </div>

      {/* Dropdown / Icon */}
      <button onClick={handleLogout} title="Logout">
        <LogOut className="text-red-500 cursor-pointer" />
      </button>
    </div>
  );
};

export default UserHeader;

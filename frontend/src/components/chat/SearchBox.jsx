import { useEffect, useState } from "react";
import api from "../../api/axios";
import { accessChat } from "../../api/chatApi";
import { useChat } from "../../context/ChatContext";

const SearchBox = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { chats, setChats, setSelectedChat } = useChat();

  //debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/user?search=${query}`);
        setResults(data);
      } catch (err) {
        console.error("User search failed", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleUserClick = async (user) => {
    try {
      const chat = await accessChat(user._id);

      setChats((prev) => {
        const exists = prev.find((c) => c._id === chat._id);
        return exists ? prev : [chat, ...prev];
      });

      setSelectedChat(chat); // opens chat window
      setQuery("");
      setResults([]);
    } catch (err) {
      console.error("Failed to access chat", err);
    }
  };


  return (
    <div className="relative p-3 border-b">
      <input
        type="text"
        placeholder="Search or start new chat"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-gray-100 outline-none"
      />

      {query && (
        <div className="absolute left-0 right-0 mt-2 bg-white shadow-lg rounded-lg max-h-64 overflow-y-auto z-10">
          {loading && <p className="p-3 text-sm text-gray-500">Searching...</p>}

          {!loading && results.length === 0 && (
            <p className="p-3 text-sm text-gray-500">No users found</p>
          )}

          {results.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user)}
              className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
            >
              <img src={user.pic} className="w-8 h-8 rounded-full" alt="user" />
              <div>
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;

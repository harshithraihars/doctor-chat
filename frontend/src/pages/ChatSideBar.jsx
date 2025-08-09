import { IoIosClose } from "react-icons/io";
import { LuMessageSquareText } from "react-icons/lu";
import { PiPlus } from "react-icons/pi";

const ChatSidebar = ({
  chatList,
  onSelectChat,
  setIsSidebarOpen,
  isHistoryLoading,
  handlenewChat,
  activeChat,
}) => {  
  return (
    <div className="h-full w-full bg-gradient-to-b from-cyan-300 via-cyan-100 to-white shadow-xl border-r border-cyan-100 flex flex-col relative pt-6 px-4">
      {/* Mobile close button */}
      <button
        onClick={() => setIsSidebarOpen(false)}
        className="absolute top-3 right-4 text-gray-700 md:hidden"
        aria-label="Close Sidebar"
      >
        <IoIosClose size={28} />
      </button>

      {/* New Chat Button */}
      <button
        className="w-full flex items-center justify-center gap-2 px-4 py-2 mb-6 mt-4 rounded-xl bg-white/80 text-gray-800 font-semibold hover:bg-white hover:shadow transition"
        onClick={() => handlenewChat()}
      >
        <PiPlus size={18} />
        New Chat
      </button>

      {/* Recent Chats */}
      <h2 className="text-sm font-semibold text-gray-600 mb-3 tracking-wide">
        Recent Chats
      </h2>

      <div className="flex-1 overflow-y-auto space-y-4 pb-6">
        {isHistoryLoading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-4 rounded-md bg-white/40 shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="h-4 w-3/4 rounded bg-gray-300 animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : chatList.length === 0 ? (
          <div className="text-center text-sm text-gray-400">
            No chats found.
          </div>
        ) : (
          chatList.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-[#4ed1ef] text-gray-800 font-medium cursor-pointer transition-all truncate shadow-sm ${
  activeChat.id === chat.id ? "bg-[#4ed1ef]" : "bg-white/40"
}`}
            >
              <LuMessageSquareText size={18} />
              <span className="truncate">{chat.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;

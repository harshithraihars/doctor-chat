import healthBotImg from "../assets/images/healthbot.png";
import { HiPaperAirplane } from "react-icons/hi";
import { FiSidebar } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef } from "react";
import ChatSkeletonLoader from "./ChatSkeletonLoader";


const MainChatArea = ({
  messages,
  inputMessage,
  setInputMessage,
  sendMessage,
  handleFileUpload,
  isSidebarOpen,
  setIsSidebarOpen,
  isBotTyping,
  isMessagesLoading
}) => {
  
  const messagesEndRef = useRef(null);
  const isFirstRender = useRef(true);
  const scrollContainerRef = useRef(null);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // ✅ Scroll only inside the chat container
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);


  return (
    <div className="w-full flex flex-col h-full px-2 sm:px-4 md:px-6 py-4">
      {/* Chat Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-cyan-300 to-cyan-100 p-4 rounded-t-xl shadow-sm">
        <div className="flex items-center gap-3">
          {/* Sidebar toggle for mobile */}
          <button
            className="md:hidden text-xl"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FiSidebar />
          </button>
          <img src={healthBotImg} className="w-10 h-10 rounded-full" />
          <div>
            <h3 className="font-semibold text-lg text-black">Health Bot</h3>
            <p className="text-sm text-green-700">online</p>
          </div>
        </div>
      </div>

      {/* Chat Content (Isolated Scroll Area) */}
      <div className="flex-1 overflow-hidden min-h-0">
        <div
          className="h-full overflow-y-auto px-4 py-4 bg-white shadow-md rounded-b-xl"
          ref={scrollContainerRef}
        >{
          isMessagesLoading?(
            <ChatSkeletonLoader/>
          ):(messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-3 ${
                msg.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block px-4 py-2 rounded-lg text-sm max-w-[80%] break-words ${
                  msg.sender === "user"
                    ? "bg-blue-100 text-gray-800"
                    : "bg-cyan-100 text-gray-800"
                }`}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
                {msg.file && (
                  <div className="mt-1">
                    <a
                      href={URL.createObjectURL(msg.file)}
                      download={msg.file.name}
                      className="text-xs underline"
                    >
                      {msg.file.name}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )))
        }
          

          {/* Typing Indicator */}
          {isBotTyping && (
            <div className="mb-3 text-left">
              <div className="inline-block px-4 py-2 rounded-lg text-sm bg-cyan-100 text-gray-800">
                <div className="flex items-center space-x-1 h-5">
                  <span className="dot bg-gray-700"></span>
                  <span className="dot bg-gray-700"></span>
                  <span className="dot bg-gray-700"></span>
                </div>
              </div>
            </div>
          )}

          {/* Scroll Anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Field */}
      <form
        onSubmit={sendMessage}
        className="flex items-center gap-3 mt-4 bg-white p-3 rounded-xl shadow-md"
      >
        <label htmlFor="file-upload" className="cursor-pointer text-xl">
          📁
        </label>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileUpload}
        />
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-cyan-200 rounded-lg focus:outline-none"
          disabled={isBotTyping}
        />
        <button
          type="submit"
          disabled={isBotTyping}
          className={`p-3 rounded-full text-white shadow-md flex items-center justify-center text-xl transition-all duration-200 ${
            isBotTyping
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          <HiPaperAirplane />
        </button>
      </form>
    </div>
  );
};

export default MainChatArea;

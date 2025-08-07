// src/pages/HealthBotPage.jsx
import { useEffect, useState } from "react";
import MainChatArea from "./ChatArea";
import ChatSidebar from "./ChatSideBar";
import useChat from "../utils/useChat";

const HealthBotPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    messages,
    inputMessage,
    chatList,
    isBotTyping,
    isHistoryLoading,
    isMessagesLoading,
    setInputMessage,
    fetchChatHistory,
    sendMessage,
    handleChatSelect,
    startNewChat,
    setSelectedFileExternally,
  } = useChat();

  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setSelectedFileExternally(file);
  };

  return (
    <div className="flex h-[90dvh] bg-gradient-to-b from-cyan-100 to-white overflow-hidden">
      {/* Sidebar */}
      <div
        className={`h-full w-80 z-50 transform transition-transform duration-300 bg-cyan-50 shadow-xl
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static absolute top-0 left-0`}
      >
        <ChatSidebar
          chatList={chatList}
          onSelectChat={handleChatSelect}
          setIsSidebarOpen={setIsSidebarOpen}
          isHistoryLoading={isHistoryLoading}
          handlenewChat={startNewChat}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        <MainChatArea
          messages={messages}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          sendMessage={sendMessage}
          handleFileUpload={handleFileUpload}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isBotTyping={isBotTyping}
          isMessagesLoading={isMessagesLoading}
        />
      </div>
    </div>
  );
};

export default HealthBotPage;

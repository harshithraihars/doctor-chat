// ChatInterface.js
import React from "react";
import ClientSidebar from "./ChatSideBar";
import ChatArea from "./ChatArea";

const ChatInterface = ({
  user,
  clientList,
  selectedClientId,
  unreadCounts,
  connectionDetails,
  messages,
  onClientSelect,
  onSendMessage
}) => {
  return (
    <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow-lg overflow-hidden h-[600px]">
      
      {/* Doctor's Client Sidebar */}
      {user?.Role === "Doctor" && (
        <div className="w-full lg:w-2/5 border-b lg:border-b-0 lg:border-r border-gray-200">
          <ClientSidebar
            clientList={clientList}
            selectedClientId={selectedClientId}
            unreadCounts={unreadCounts}
            onClientSelect={onClientSelect}
          />
        </div>
      )}

      {/* Chat Area */}
      <div className={`flex-1 ${user?.Role === "Doctor" ? "lg:w-3/5" : "w-full"}`}>
        <ChatArea
          user={user}
          clientList={clientList}
          selectedClientId={selectedClientId}
          connectionDetails={connectionDetails}
          messages={messages}
          onSendMessage={onSendMessage}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
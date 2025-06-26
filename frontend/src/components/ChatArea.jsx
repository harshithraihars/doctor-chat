// ChatArea.js
import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import docImg from "../assets/images/doc.png";
import userImg from "../assets/images/user.png";

const ChatArea = ({
  user,
  clientList,
  selectedClientId,
  connectionDetails,
  messages,
  onSendMessage
}) => {
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    onSendMessage(messageInput);
    setMessageInput("");
  };
  
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const getChatPartnerName = () => {
    if (user?.Role === "Doctor") {
      return clientList.find(c => c.socketId === selectedClientId)?.clientName || "Client";
    }
    return connectionDetails.receiverName || "Doctor";
  };
  
  return (
    <div className="flex flex-col h-full">
      
      {/* Chat Header */}
      <div className="bg-[#64f9fa] text-black px-4 py-3 flex justify-between items-center border-b">
        <div className="flex items-center gap-3">
          <button className="text-gray-700 hover:text-gray-900 transition-colors lg:hidden">
            <FaArrowLeft size={18} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-50 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img
                src={user?.Role === "Doctor" ? userImg : docImg}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-base lg:text-lg font-semibold">
                {getChatPartnerName()}
              </h2>
              <p className="text-xs lg:text-sm text-gray-600">
                {user?.Role === "Doctor" ? "Client" : "Doctor"}
              </p>
            </div>
          </div>
        </div>
        
        <button className="text-gray-700 hover:text-gray-900 transition-colors">
          <HiDotsVertical size={20} />
        </button>
      </div>
      
      {/* Messages Area - Fixed Height */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50" style={{ height: '400px', maxHeight: '400px' }}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg">No messages yet</p>
              <p className="text-sm mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
            >
              <div className="flex flex-col max-w-xs lg:max-w-md">
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.isBot
                      ? "bg-white text-gray-800 shadow-sm border border-gray-100"
                      : "bg-blue-500 text-white shadow-sm"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                <p className={`text-xs mt-1 ${
                  message.isBot ? "text-gray-500 text-left" : "text-gray-400 text-right"
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input - Fixed at Bottom */}
      <div className="border-t bg-white p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send } from "lucide-react";
import docImg from "../assets/images/doc.png";
import userImg from "../assets/images/user.png";
import { FaArrowLeft } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import Loading from "./Loading";
import SelectSpecialist from "./SelectSpecialist";

const HealthBotMobileTablet = ({
  user,
  specialist,
  connectionDetails,
  selectedClientId,
  setSelectedClientId,
  clientList,
  unreadCounts,
  messageInput,
  setMessageInput,
  handleSendMessage,
  handleClientSelect,
  getCurrentMessages,
  messagesEndRef,
  chatData, // Add this prop
}) => {
  const [showChatList, setShowChatList] = useState(true);
  
  // Add scroll container ref for mobile
  const mobileScrollContainerRef = useRef(null);

  // Mobile scroll function
  const scrollToBottom = useCallback(() => {
    if (mobileScrollContainerRef.current) {
      const scrollContainer = mobileScrollContainerRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, []);

  // Navigation logic for different user roles
  useEffect(() => {
    if (user?.Role === "Client") {
      setShowChatList(false);
    } else if (user?.Role === "Doctor") {
      // For doctors, show chat list by default, but hide it when a client is selected
      if (selectedClientId) {
        setShowChatList(false);
      } else {
        setShowChatList(true);
      }
    }
  }, [user, selectedClientId]);

  // Auto-scroll effect for mobile
  useEffect(() => {
    const currentChatId =
      user?.Role === "Doctor"
        ? selectedClientId
        : connectionDetails.receiverSocketId;

    if (currentChatId && chatData[currentChatId]?.length > 0) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [chatData, selectedClientId, connectionDetails.receiverSocketId, user?.Role, scrollToBottom]);

  const handleChatSelect = (client) => {
    handleClientSelect(client);
    setShowChatList(false);
  };

  const handleBackToList = () => {
    setShowChatList(true);
    setSelectedClientId(null);
  };

  // Show specialist selection for clients without a specialist
  if (user.Role === "Client" && !specialist) {
    return <SelectSpecialist />;
  }

  // Unified Layout for Mobile
  return (
    <div className="flex flex-col h-[550px] bg-gradient-to-br from-[#E0FBFC] via-[#C2F0F2] to-[#A0E3F0] px-2 py-4">
      {/* Header - Only show for chat list view */}
      {showChatList && (
        <div className="bg-[#64f9fa] px-4 py-3 flex justify-between items-center shadow-md rounded-t-lg">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-800">
              {user?.Role === "Doctor" ? "Chats" : "HealthBot"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {user?.Role === "Doctor" && (
              <IoSearch
                size={20}
                className="text-gray-700 hover:text-gray-900 cursor-pointer transition-colors"
              />
            )}
            <HiDotsVertical
              size={20}
              className="text-gray-700 hover:text-gray-900 cursor-pointer transition-colors"
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-scroll">
        <div
          className={`h-full bg-white ${
            showChatList ? "" : "rounded-lg"
          } shadow-md flex`}
        >
          {/* Sidebar for Doctors - Only show when showing chat list */}
          {user?.Role === "Doctor" && showChatList && (
            <div className="w-full p-4">
              <div className="overflow-y-auto h-full">
                {clientList.length === 0 ? (
                  <Loading />
                ) : (
                  clientList.map((client, index) => (
                    <div
                      key={index}
                      onClick={() => handleChatSelect(client)}
                      className="p-3 rounded-lg mb-2 cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#64F9FA] flex justify-between items-center border bg-white border-gray-200 hover:border-blue-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-50 rounded-full overflow-hidden">
                          <img
                            src={userImg}
                            alt="client"
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-800 truncate">
                            {client.clientName}
                          </p>
                          <p className="text-gray-500 text-xs truncate">
                            {client.lastMessage}
                          </p>
                        </div>
                      </div>
                      {unreadCounts[client.socketId] && (
                        <div className="bg-[#64F9FA] text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {unreadCounts[client.socketId]}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Chat Area */}
          {!showChatList && (
            <div className="flex-1 flex flex-col">
              {user?.Role === "Doctor" && !selectedClientId ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Loading />
                    <p className="mt-4 text-gray-600">
                      Select a chat to start messaging
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="bg-[#64f9fa] px-4 py-3 flex justify-between items-center border-b rounded-t-lg">
                    <div className="flex items-center gap-3">
                      {/* Back button positioned before profile icon */}
                      {user?.Role === "Doctor" && (
                        <button
                          onClick={handleBackToList}
                          className="text-gray-700 hover:text-gray-900 transition-colors"
                        >
                          <FaArrowLeft size={20} />
                        </button>
                      )}
                      <div className="h-10 w-10 bg-slate-50 rounded-full overflow-hidden">
                        <img
                          src={user?.Role === "Doctor" ? userImg : docImg}
                          alt="avatar"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div>
                        <h2 className="font-semibold text-sm">
                          {user?.Role === "Doctor"
                            ? clientList.find(
                                (c) => c.socketId === selectedClientId
                              )?.clientName || "Client"
                            : connectionDetails.receiverName || "Doctor"}
                        </h2>
                        <p className="text-green-500 text-xs font-medium">
                          online
                        </p>
                      </div>
                    </div>
                    <HiDotsVertical
                      size={20}
                      className="text-gray-700 hover:text-gray-900 cursor-pointer transition-colors"
                    />
                  </div>

                  {/* Messages - Added scroll container ref */}
                  <div 
                    className="flex-1 overflow-y-auto p-4"
                    ref={mobileScrollContainerRef}
                  >
                    {getCurrentMessages().map((message, index) => (
                      <div
                        key={index}
                        className={`mb-4 ${
                          message.isBot ? "text-left" : "text-right"
                        }`}
                      >
                        <div
                          className={`inline-block p-3 rounded-lg max-w-xs ${
                            message.isBot
                              ? "bg-gray-100 text-gray-800"
                              : "bg-blue-500 text-white"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.isBot ? "text-gray-500" : "text-blue-100"
                            }`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-400 text-sm transition-all"
                        placeholder="Type your message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                      />
                      <button
                        className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors duration-300 flex-shrink-0"
                        onClick={handleSendMessage}
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Footer - Only show when showing chat list */}
      {showChatList && (
        <div className="bg-[#64f9fa] px-4 py-3 flex justify-center items-center shadow-md rounded-b-lg">
          <p className="text-gray-400 text-sm font-medium">HealthBot Assistant</p>
        </div>
      )}
    </div>
  );
};

export default HealthBotMobileTablet;
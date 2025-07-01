import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { HiDotsVertical } from 'react-icons/hi';
import { Send } from 'lucide-react';

const ChatWindowComponent = ({
  user,
  userImg,
  docImg,
  clientList,
  selectedClientId,
  connectionDetails,
  getCurrentMessages,
  messagesEndRef,
  messageInput,
  setMessageInput,
  handleSendMessage,
  onBackClick
}) => {
  const getDisplayName = () => {
    if (user?.Role === "Doctor") {
      return clientList.find(c => c.socketId === selectedClientId)?.clientName || "Client";
    }
    return connectionDetails.receiverName;
  };

  const getDisplayImage = () => {
    return user?.Role === "Doctor" ? userImg : docImg;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#64f9fa] text-black px-3 py-3 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Back button - only show on mobile for doctors */}
          {onBackClick && (
            <button 
              onClick={onBackClick}
              className="text-xl font-bold text-gray-700 md:hidden"
            >
              <FaArrowLeft size={24} />
            </button>
          )}

          <div className="flex items-center">
            <div className="h-10 w-10 md:h-12 md:w-12 bg-slate-50 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={getDisplayImage()}
                alt="profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="pl-3">
              <h2 className="text-lg md:text-xl font-semibold truncate">
                {getDisplayName()}
              </h2>
              <p className="text-green-600 font-semibold text-sm">online</p>
            </div>
          </div>
        </div>

        <button className="text-xl font-bold text-gray-700 flex-shrink-0">
          <HiDotsVertical size={25} className="text-black" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
        {getCurrentMessages().map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.isBot ? "text-left" : "text-right"
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ${
                message.isBot
                  ? "bg-white shadow-sm"
                  : "bg-blue-500 text-white"
              }`}
            >
              <p className="text-sm break-words">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.isBot ? "text-gray-500" : "text-blue-100"
              }`}>
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-3 md:p-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 p-2 md:p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 text-sm md:text-base"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && handleSendMessage()
            }
          />
          <button
            className="bg-blue-500 text-white p-2 md:p-3 rounded-full hover:bg-blue-600 transition duration-300 flex-shrink-0"
            onClick={handleSendMessage}
          >
            <Send size={18} className="md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindowComponent;
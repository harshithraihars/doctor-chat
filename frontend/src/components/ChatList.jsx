import React from 'react';
import { IoSearch } from 'react-icons/io5';

const ChatListComponent = ({ 
  clientList, 
  selectedClientId, 
  handleClientSelect, 
  unreadCounts,
  onChatSelect 
}) => {
  const handleChatClick = (client) => {
    handleClientSelect(client);
    if (onChatSelect) {
      onChatSelect(client);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <h3 className="font-bold text-gray-600 text-lg">Chats</h3>
        <IoSearch size={20} className="hover:cursor-pointer text-gray-600" />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {clientList.map((client, index) => (
          <div
            onClick={() => handleChatClick(client)}
            key={index}
            className={`${
              selectedClientId === client.socketId
                ? "bg-[#64F9FA]"
                : "bg-white hover:bg-gray-50"
            } p-4 border-b border-gray-100 cursor-pointer
            transition duration-200 ease-in-out flex justify-between items-center`}
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">
                {client.clientName}
              </p>
              <p className="text-gray-500 text-sm truncate mt-1">
                {client.lastMessage}
              </p>
            </div>
            <div className="ml-3 flex-shrink-0">
              {unreadCounts[client.socketId] &&
              selectedClientId !== client.socketId ? (
                <div className="bg-[#64F9FA] text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-semibold">
                  {unreadCounts[client.socketId]}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatListComponent;
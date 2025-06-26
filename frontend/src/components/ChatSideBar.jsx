// ClientSidebar.js
import React from "react";
import { IoSearch } from "react-icons/io5";

const ClientSidebar = ({
  clientList,
  selectedClientId,
  unreadCounts,
  onClientSelect
}) => {
  return (
    <div className="h-full p-4 bg-gray-50">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <h3 className="font-bold text-gray-700 text-lg">Chats</h3>
        <IoSearch 
          size={20} 
          className="hover:cursor-pointer text-gray-500 hover:text-gray-700 transition-colors" 
        />
      </div>
      
      {/* Client List */}
      <div className="space-y-2 overflow-y-auto max-h-[500px]">
        {clientList.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No clients yet</p>
            <p className="text-sm mt-1">Waiting for connections...</p>
          </div>
        ) : (
          clientList.map((client) => (
            <div
              key={client.socketId}
              onClick={() => onClientSelect(client)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                selectedClientId === client.socketId
                  ? "bg-[#64F9FA] border-blue-300 shadow-md"
                  : "bg-white border-gray-200 hover:bg-gray-100 hover:shadow-sm"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <p className="font-semibold text-gray-800 truncate text-sm">
                      {client.clientName}
                    </p>
                  </div>
                  <p className="text-gray-500 text-xs truncate ml-4">
                    {client.lastMessage}
                  </p>
                </div>
                
                {/* Unread Badge */}
                {unreadCounts[client.socketId] > 0 && selectedClientId !== client.socketId && (
                  <div className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2 animate-pulse">
                    {unreadCounts[client.socketId]}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientSidebar;
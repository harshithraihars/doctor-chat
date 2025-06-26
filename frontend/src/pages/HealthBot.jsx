import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send } from "lucide-react";
import sendSound from "../assets/images/send.mp3";
import messageSound from "../assets/images/message.mp3";
import docImg from "../assets/images/doc.png";
import userImg from "../assets/images/user.png";
import { FaArrowLeft } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useAuth } from "../contexts/AuthContext";
import { ClipLoader } from "react-spinners";
import { socket } from "../Socket/Socket";

const HealthBot = () => {
  // Audio instances
  const sendAudio = useRef(new Audio(sendSound));
  const messageAudio = useRef(new Audio(messageSound));
  
  // Auth context
  const { user, setUser } = useAuth();
  
  // State management
  const [connectionDetails, setConnectionDetails] = useState({
    receiverName: null,
    receiverSocketId: null,
    role: null,
  });
  
  const [chatData, setChatData] = useState({}); // Store all chat conversations
  const [selectedClientId, setSelectedClientId] = useState(null); // Currently selected client for doctor
  const [clientList, setClientList] = useState([]); // List of clients for doctor sidebar
  const [unreadCounts, setUnreadCounts] = useState({}); // Unread message counts
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs
  const messagesEndRef = useRef(null);
  
  // Helper functions
  const playSound = useCallback((audioRef) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    }
  }, []);
  
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  
  // Initialize connection details from localStorage
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("auth"));
    const assignedDoctor = JSON.parse(localStorage.getItem("assignedDoctor"));
    
    if (savedUser) {
      setUser(savedUser);
      
      if (assignedDoctor && savedUser.Role === "Client") {
        setConnectionDetails({
          receiverSocketId: assignedDoctor.sockId,
          receiverName: assignedDoctor.name,
          role: assignedDoctor.role,
        });
      }
      
      setIsLoading(false);
    }
  }, [setUser]);
  
  // Socket event handlers
  const handleReceiveMessage = useCallback(({ message, fromId, senderName }) => {
    console.log("Message received:", { message, fromId, senderName });
    
    // Update connection details if not set (for dynamic connections)
    if (!connectionDetails.receiverSocketId && user?.Role === "Client") {
      setConnectionDetails({
        receiverSocketId: fromId,
        receiverName: senderName,
        role: "Doctor",
      });
    }
    
    // Handle doctor's client list management
    if (user?.Role === "Doctor") {
      setClientList(prevList => {
        const existingClient = prevList.find(client => client.socketId === fromId);
        
        if (existingClient) {
          // Update existing client's last message
          return prevList.map(client =>
            client.socketId === fromId
              ? { ...client, lastMessage: message, timestamp: Date.now() }
              : client
          );
        } else {
          // Add new client
          return [...prevList, {
            socketId: fromId,
            clientName: senderName,
            lastMessage: message,
            timestamp: Date.now(),
          }];
        }
      });
      
      // Auto-select first client if none selected
      if (!selectedClientId) {
        setSelectedClientId(fromId);
      }
      
      // Update unread count for non-selected clients
      if (selectedClientId !== fromId) {
        setUnreadCounts(prev => ({
          ...prev,
          [fromId]: (prev[fromId] || 0) + 1,
        }));
      }
    }
    
    // Add message to chat data
    const newMessage = {
      id: Date.now() + Math.random(),
      text: message,
      isBot: true,
      timestamp: Date.now(),
      senderId: fromId,
      senderName: senderName,
    };
    
    setChatData(prevChats => ({
      ...prevChats,
      [fromId]: [...(prevChats[fromId] || []), newMessage],
    }));
    
    // Play notification sound
    playSound(messageAudio);
  }, [connectionDetails, user, selectedClientId, playSound]);
  
  // Socket listeners
  useEffect(() => {
    if (!socket) return;
    
    socket.on("receive-message", handleReceiveMessage);
    
    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [handleReceiveMessage]);
  
  // Auto-scroll to bottom when messages change
  // useEffect(() => {
  //   scrollToBottom();
  // }, [chatData, scrollToBottom]);
  
  // Message sending logic
  const handleSendMessage = useCallback(() => {
    if (!messageInput.trim()) return;
    
    const targetReceiverId = user?.Role === "Doctor" 
      ? selectedClientId 
      : connectionDetails.receiverSocketId;
    
    if (!targetReceiverId) {
      console.warn("No receiver selected");
      return;
    }
    
    // Create message object
    const newMessage = {
      id: Date.now() + Math.random(),
      text: messageInput.trim(),
      isBot: false,
      timestamp: Date.now(),
      senderId: socket.id,
      senderName: user?.Name || user?.fullName,
    };
    
    // Add to local chat data
    setChatData(prevChats => ({
      ...prevChats,
      [targetReceiverId]: [...(prevChats[targetReceiverId] || []), newMessage],
    }));
    
    // Send via socket
    const messageData = {
      toId: targetReceiverId,
      message: messageInput.trim(),
      fromId: socket.id,
      senderName: user?.Name || user?.fullName,
    };
    
    socket.emit("send-message", messageData);
    
    // Clear input and play sound
    setMessageInput("");
    playSound(sendAudio);
  }, [messageInput, user, selectedClientId, connectionDetails, playSound]);
  
  // Handle client selection (for doctors)
  const handleClientSelect = useCallback((client) => {
    setSelectedClientId(client.socketId);
    
    // Clear unread count for selected client
    setUnreadCounts(prev => ({
      ...prev,
      [client.socketId]: 0,
    }));
  }, []);
  
  // Get current chat messages
  const getCurrentMessages = () => {
    const chatId = user?.Role === "Doctor" ? selectedClientId : connectionDetails.receiverSocketId;
    return chatData[chatId] || [];
  };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("assignedDoctor");
    // Add your logout logic here
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#36d7b7" size={50} />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col lg:flex-row w-screen bg-gradient-to-br from-[#E0FBFC] via-[#C2F0F2] to-[#A0E3F0]">
      {/* Profile Box */}
      <div className="w-4/5 lg:w-1/5 h-[500px] border-2 border-black border-solid mt-10 mx-auto lg:ml-20 rounded-[30px] bg-[#64F9FA]">
        <div className="mt-12 w-full flex items-center justify-center">
          <div>
            <img
              src="src/assets/images/profile.png"
              alt="profile"
              className="w-24 h-24 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
            />
          </div>
        </div>
        <div className="font-bold flex justify-center w-full mt-4">
          {user?.Name || user?.fullName}
        </div>
        <div className="w-full flex justify-center mt-4">
          <button 
            onClick={handleLogout}
            className="font-bold px-4 py-1 bg-green-500 border-none text-white rounded-xl"
          >
            Log Out
          </button>
        </div>
        <div className="bg-gray-100 w-52 p-2 rounded-2xl mx-auto lg:ml-12 mt-6 lg:mr-10">
          Hii {user?.Name || "User"}!, Welcome back
        </div>
        <div className="w-full flex flex-col items-center mt-10">
          <p className="text-gray-400">Yesterday</p>
          <div>Greeting Exchange...</div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div
        className={`container mx-auto px-4 py-8 ${
          user?.Role == "Doctor" ? "lg:w-[1000px]" : "lg:w-[700px]"
        }`}
      >
        {user?.Role == "Doctor" && !selectedClientId ? (
          <div className="w-full flex justify-center items-center mt-40 flex-col gap-6 animate-fadeIn">
            <p className="text-green-800 text-2xl font-semibold animate-pulse tracking-wider">
              Finding clients...
            </p>
            <ClipLoader
              color="#36d7b7"
              loading={true}
              size={100}
              cssOverride={{ borderWidth: "8px" }}
            />
          </div>
        ) : (
          <div>
            <div className="flex  mx-auto bg-white rounded-lg shadow-md overflow-hidden">
              {/* Sidebar for Doctor Chats */}
              {user?.Role == "Doctor" ? (
                <div className="w-2/4 border-r border-gray-200 p-4 ">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-left mb-4 text-gray-600">
                      Chats
                    </h3>
                    <IoSearch size={20} className="mb-2 hover:cursor-pointer" />
                  </div>
                  {clientList.map((client, index) => (
                    <div
                      onClick={() => handleClientSelect(client)}
                      key={index}
                      className={` ${
                        selectedClientId === client.socketId
                          ? "bg-[#64F9FA]"
                          : "bg-white"
                      } p-3 rounded-lg mb-2 shadow-md border border-gray-200 cursor-pointer
              transition duration-300 ease-in-out hover:bg-[#64F9FA] flex justify-between items-center`}
                    >
                      <div>
                        <p className="font-semibold">{client.clientName}</p>
                        <p className="text-gray-500 text-sm truncate">
                          {client.lastMessage}
                        </p>
                      </div>
                      <div>
                        {unreadCounts[client.socketId] &&
                        selectedClientId !== client.socketId ? (
                          <p className="text-white rounded-xl mr-4 h-6 w-6 text-center bg-[#64F9FA]">
                            {unreadCounts[client.socketId]}
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                ""
              )}

              {/* Chat Area */}
              <div className="w-2/3 lg:w-[700px] rounded-xl">
                <div className="bg-[#64f9fa] text-black px-3 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button className="text-xl font-bold text-gray-700">
                      <FaArrowLeft size={30} />
                    </button>

                    <div className="flex items-center">
                      <div className="h-12 w-12 bg-slate-50 rounded-full">
                        <img
                          src={`${user?.Role === "Doctor" ? userImg : docImg}`}
                          alt="doctor"
                          className="rounded-full"
                        />
                      </div>
                      <div className="pl-2">
                        <h2 className="text-xl font-semibold">
                          {user?.Role === "Doctor" 
                            ? clientList.find(c => c.socketId === selectedClientId)?.clientName || "Client"
                            : connectionDetails.receiverName
                          }
                        </h2>
                        {user && (
                          <p></p>
                        )}
                      </div>
                    </div>
                  </div>

                  <button className="text-xl font-bold text-gray-700">
                    <HiDotsVertical size={25} className="text-black" />
                  </button>
                </div>
                <div className="h-96 overflow-y-auto p-6">
                  {getCurrentMessages().map((message, index) => (
                    <div
                      key={index}
                      className={`mb-4 ${
                        message.isBot ? "text-left" : "text-right"
                      }`}
                    >
                      <div
                        className={`inline-block p-3 rounded-lg ${
                          message.isBot
                            ? "bg-gray-100"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
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
                <div className="border-t p-4">
                  <div className="flex items-center">
                    <input
                      type="text"
                      className="flex-grow mr-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-400"
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                    />
                    <button
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300"
                      onClick={handleSendMessage}
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthBot;
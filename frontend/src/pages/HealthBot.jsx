import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
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
import ProfileSidebar from "../components/ProfileSideBar";
import Loading from "./Loading";
import SelectSpecialist from "./SelectSpecialist";
import HealthBotMobileTablet from "./HealthBotResponsive";
import PeerDisconnectedPopup from "./peerDisconnectPopup";
import { useLocation, useMatch } from "react-router-dom";

const HealthBot = () => {
  const {pathname}=useLocation()
  const currentPage = pathname.slice(1);
  

  // Audio instances
  const sendAudio = new Audio(sendSound);
  const messageAudio = new Audio(messageSound);

  // Auth context
  const { user, setUser, specialist, chatData, setChatData, setSpecialist } =
    useAuth();

  // State management
  const [connectionDetails, setConnectionDetails] = useState({
    receiverName: null,
    receiverSocketId: null,
    role: null,
  });

  const [selectedClientId, setSelectedClientId] = useState(null);
  const [clientList, setClientList] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [peerDisconnnected, setPeerDisconnected] = useState(false);

  // Fixed refs - use only one scroll container ref
  const scrollContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Improved scroll function
  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, []);

  // Helper function
  const playSound = (audio) => {
    sendAudio.currentTime = 0;
    messageAudio.currentTime = 0;
    audio.play();
  };

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
        setSpecialist(assignedDoctor.role);
      }

      setIsLoading(false);
    }
  }, [setUser]);

  // Socket event handlers
  const handleReceiveMessage = useCallback(
    ({ message, fromId, senderName }) => {
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
        setClientList((prevList) => {
          const existingClient = prevList.find(
            (client) => client.socketId === fromId
          );

          if (existingClient) {
            return prevList.map((client) =>
              client.socketId === fromId
                ? { ...client, lastMessage: message, timestamp: Date.now() }
                : client
            );
          } else {
            return [
              ...prevList,
              {
                socketId: fromId,
                clientName: senderName,
                lastMessage: message,
                timestamp: Date.now(),
              },
            ];
          }
        });

        if (!selectedClientId) {
          setSelectedClientId(fromId);
        }

        if (selectedClientId !== fromId) {
          setUnreadCounts((prev) => ({
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

      setChatData((prevChats) => ({
        ...prevChats,
        [fromId]: [...(prevChats[fromId] || []), newMessage],
      }));


      console.log(currentPage);
      
      // if(currentPage!="health-bot"){
      //   toast.success(`${connectionDetails.receiverName}:${message}`)
      // }
      playSound(messageAudio);
    },
    [connectionDetails, user, selectedClientId, playSound]
  );

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [handleReceiveMessage]);

  // Auto-scroll effect - Fixed and uncommented
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

  // Message sending logic
  const handleSendMessage = useCallback(() => {
    if (!messageInput.trim()) return;

    const targetReceiverId =
      user?.Role === "Doctor"
        ? selectedClientId
        : connectionDetails.receiverSocketId;

    if (!targetReceiverId) {
      console.warn("No receiver selected");
      return;
    }

    const newMessage = {
      id: Date.now() + Math.random(),
      text: messageInput.trim(),
      isBot: false,
      timestamp: Date.now(),
      senderId: socket.id,
      senderName: user?.Name || user?.fullName,
    };

    setChatData((prevChats) => ({
      ...prevChats,
      [targetReceiverId]: [...(prevChats[targetReceiverId] || []), newMessage],
    }));

    const messageData = {
      toId: targetReceiverId,
      message: messageInput.trim(),
      fromId: socket.id,
      senderName: user?.Name || user?.fullName,
    };

    socket.emit("send-message", messageData);

    setMessageInput("");
    playSound(sendAudio);
  }, [messageInput, user, selectedClientId, connectionDetails, playSound]);

  // Handle client selection (for doctors)
  const handleClientSelect = useCallback((client) => {
    setSelectedClientId(client.socketId);

    setUnreadCounts((prev) => ({
      ...prev,
      [client.socketId]: 0,
    }));
  }, []);

  // Get current chat messages
  const getCurrentMessages = () => {
    const chatId =
      user?.Role === "Doctor"
        ? selectedClientId
        : connectionDetails.receiverSocketId;
    return chatData[chatId] || [];
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("assignedDoctor");
  };

  const commonProps = {
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
  handleLogout,
  messagesEndRef,
  chatData,
};

  socket.on("peer-disconnected", () => {
    setPeerDisconnected(true);
  });

  if (user.Role == "Client" && !specialist) {
    return <SelectSpecialist />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#36d7b7" size={50} />
      </div>
    );
  }

  if (peerDisconnnected) {
    return (
      <PeerDisconnectedPopup
        isOpen={peerDisconnnected}
        setPeerDisconnected={setPeerDisconnected}
        peerName={connectionDetails.receiverName}
      />
    );
  }

  return (
    <div>
      <div className="hidden lg:flex flex-col lg:flex-row w-screen bg-gradient-to-br from-[#E0FBFC] via-[#C2F0F2] to-[#A0E3F0]">
        <ProfileSidebar user={user} handleLogout={handleLogout} />

        <div
          className={`container mx-auto px-4 py-8 ${
            user?.Role == "Doctor" ? "lg:w-[1000px]" : "lg:w-[700px]"
          }`}
        >
          {user?.Role == "Doctor" && !selectedClientId ? (
            <Loading />
          ) : (
            <div>
              <div className="flex mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                {/* Sidebar for Doctor Chats */}
                {user?.Role == "Doctor" ? (
                  <div className="w-2/4 border-r border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-left mb-4 text-gray-600">
                        Chats
                      </h3>
                      <IoSearch
                        size={20}
                        className="mb-2 hover:cursor-pointer"
                      />
                    </div>
                    {clientList.map((client, index) => (
                      <div
                        onClick={() => handleClientSelect(client)}
                        key={index}
                        className={`${
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
                            src={`${
                              user?.Role === "Doctor" ? userImg : docImg
                            }`}
                            alt="doctor"
                            className="rounded-full"
                          />
                        </div>
                        <div className="pl-2">
                          <h2 className="text-xl font-semibold">
                            {user?.Role === "Doctor"
                              ? clientList.find(
                                  (c) => c.socketId === selectedClientId
                                )?.clientName || "Client"
                              : connectionDetails.receiverName}
                          </h2>
                          <p className="text-green-500 font-semibold">online</p>
                        </div>
                      </div>
                    </div>

                    <button className="text-xl font-bold text-gray-700">
                      <HiDotsVertical size={25} className="text-black" />
                    </button>
                  </div>

                  {/* Fixed scroll container with proper ref */}
                  <div 
                    className="h-96 overflow-y-auto p-6 custom-scrollbar" 
                    ref={scrollContainerRef}
                  >
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
                    {/* Keep this div for fallback scrolling */}
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
      <div className="block lg:hidden">
        <HealthBotMobileTablet {...commonProps} />
      </div>
    </div>
  );
};

export default HealthBot;
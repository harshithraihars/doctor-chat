// src/hooks/useChatbotAPI.js
import { useCallback, useState } from "react";

const useChat = () => {
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [activeChat, setActiveChat] = useState({ id: null, title: "Untitled Chat" });
  const [inputMessage, setInputMessage] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchChatHistory = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/chatbot/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setChatList(
        data.map((chat) => ({
          id: chat.conversationId,
          name: chat.title || "Untitled Chat",
          updatedAt: chat.updatedAt,
          messages: [],
        }))
      );
      setActiveChat({ id: null, title: "Untitled Chat" });
      setMessages([]);
    } catch (err) {
      console.error("History fetch failed", err);
    } finally {
      setIsHistoryLoading(false);
    }
  }, [token]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      sender: "user",
      content: inputMessage,
      file: selectedFile,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsBotTyping(true);

    try {
      const res = await fetch("http://localhost:5000/api/chatbot/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationId: activeChat?.id || null,
        }),
      });

      const data = await res.json();
      const botMessage = {
        sender: "bot",
        content: data.botReply,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);

      if (!activeChat?.id && data.conversationId) {
        const newChat = {
          id: data.conversationId,
          name: "Untitled Chat",
          updatedAt: new Date().toISOString(),
        };
        setActiveChat(newChat);
        setChatList((prev) => [newChat, ...prev]);
      }
    } catch (err) {
      console.error("Send failed", err);
    } finally {
      setInputMessage("");
      setIsBotTyping(false);
      setSelectedFile(null);
    }
  };

  const handleChatSelect = async (chat) => {
    try {
      setIsMessagesLoading(true);
      const res = await fetch(`http://localhost:5000/api/chatbot/conversation/${chat.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const formattedMessages = data.messages.map((msg) => ({
        sender: msg.sender === "user" ? "user" : "bot",
        content: msg.content,
        timestamp: msg.timestamp || new Date().toISOString(),
      }));

      setMessages(formattedMessages);
      setActiveChat({ id: chat.id, title: chat.name });
    } catch (err) {
      console.error("Failed to load conversation", err);
    } finally {
      setIsMessagesLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setActiveChat({ id: null, title: "Untitled Chat" });
  };

  const setSelectedFileExternally = (file) => {
    setSelectedFile(file);
  };

  return {
    messages,
    inputMessage,
    chatList,
    activeChat,
    isBotTyping,
    isHistoryLoading,
    isMessagesLoading,
    setInputMessage,
    fetchChatHistory,
    sendMessage,
    handleChatSelect,
    startNewChat,
    setSelectedFileExternally,
  };
};

export default useChat;

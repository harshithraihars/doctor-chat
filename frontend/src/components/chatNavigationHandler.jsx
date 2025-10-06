import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ChatNavigationHandler() {
  const navigate = useNavigate();
  const {user,token,activeChat} = useSelector((state)=>state.auth);
  
  useEffect(() => {
    if (activeChat && activeChat?.roomId) {
      navigate(`/chat/${activeChat.roomId}`);
    }
  }, [activeChat, navigate]);

  return null; // This component doesn’t render anything
}

export default ChatNavigationHandler;

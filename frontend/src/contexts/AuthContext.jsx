import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
// import { socket, senderId } from "./Socket";
const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [chatData, setChatData] = useState({});
  const [senderId, setSenderId] = useState(null);
  const [recieverId, setRecieverId] = useState(null);
  const [specialist, setSpecialist] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [availableDoctors,setAvailableDoctors]=useState(new Set())
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (email, password, fullName) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          email,
          password,
          fullName,
        }
      );
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth");
    if (localStorage.getItem("sender")) {
      localStorage.removeItem("reciever");
      localStorage.removeItem("sender");
    }
    setUser(null);
    // socket.disconnect();
  };

  useEffect(() => {
    setIsAuthLoading(true)
    const storedUser = JSON.parse(localStorage.getItem("auth"));
    if (storedUser) setUser(storedUser);
    setIsAuthLoading(false)
  }, []);

  const value = {
    setDoctorId,
    specialist,
    setSpecialist,
    doctorId,
    isAuthLoading,
    senderId,
    recieverId,
    setRecieverId,
    doctor,
    setDoctor,
    user,
    setUser,
    login,
    register,
    logout,
    setAvailableDoctors,
    availableDoctors,
    specialist,
    chatData,
    setChatData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

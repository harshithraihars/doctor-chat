import { useEffect } from "react";
import { socket } from "./Socket";

export const useSocketInit = () => {
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (!auth || socket.connected) return;

    socket.connect();

    setupSocket({ Role: auth.Role, user: auth.Name, email: auth.email });
  }, []);
};

export const setupSocket = ({ Role, user, email }) => {
  if (!socket.connected) socket.connect();

  if (socket) {
    socket.on("connect", () => {
      if (Role == "Client") {
        socket.emit(`Client-login`, {
          id: null,
          name: user,
          role: Role,
        });
      } else {
        socket.emit("Doctor-login", {
          email:email,
        });
      }
    });
  }
};

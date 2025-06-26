import { useEffect } from "react";
import { socket } from "./Socket";

export const useSocketInit = () => {
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (!auth || socket.connected) return;

    socket.connect();

    setupSocket({ Role: auth.Role, user: auth.Name, Id: auth.Id });
  }, []);
};

export const setupSocket = ({ Role, user, Id }) => {
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
          id: Id,
        });
      }
    });
  }
};

// socketActions.js
import { io } from "socket.io-client";
import { setSocket } from "../redux/socketSlice";

let socketInstance = null;

export const initializeSocket = (token) => (dispatch) => {
  if (!socketInstance) {
    socketInstance = io("http://localhost:5000", { auth: { token } });

    socketInstance.on("connect", () => console.log("Socket connected:", socketInstance.id));
    socketInstance.on("disconnect", () => console.log("Socket disconnected"));

    dispatch(setSocket(socketInstance));
  }
  return socketInstance;
};

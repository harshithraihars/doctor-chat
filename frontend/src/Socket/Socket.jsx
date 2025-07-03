

import { io } from "socket.io-client";

const socket = io("https://doctor-chat-8184.onrender.com", {
  autoConnect: false,
  transports: ["websocket"],
  withCredentials: true,
});

socket.on("doctor-id", ({role, name, error,sockId }) => {
  if (error) {
    console.log("Doctor assignment failed:", error);
    return;
  }

  localStorage.setItem(
    "assignedDoctor",
    JSON.stringify({
      role,
      name,
      sockId
    })
  );
});

export { socket };
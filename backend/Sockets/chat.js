const jwt = require("jsonwebtoken");

let onlineUsers = new Map();

function registerChatHandlers(io, socket) {
  socket.on("message:send", (data) => {
    const { toUserId, message } = data;
    const targetSocketId = onlineUsers.get(toUserId);

    if (targetSocketId) {
      io.to(targetSocketId).emit("message:receive", {
        from: socket.userId,
        message,
      });
    } else {
      // save in DB for offline delivery
      console.log("User offline, store message in DB");
    }
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
    
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit("doctor:offline", socket.userId);
    }
  });
}

module.exports = registerChatHandlers;

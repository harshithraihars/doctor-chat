const jwt = require("jsonwebtoken");
const { onlineDoctors, activeSessions } = require("./onlineUsers");
const User = require("../models/User");
let onlineUsers = new Map();

function registerChatHandlers(io, socket) {
  socket.on("joinRoom", async ({ roomId, doctorId }, callback) => {
    socket.join(roomId);

    const client = await User.findById(socket.userId).select("name");

    const existing = activeSessions.get(socket.userId);
    if (existing && existing !== doctorId) {
      return callback?.({ success: false, error: "Already in a session" });
    }

    // set active session (both ways)
    activeSessions.set(socket.userId, doctorId);
    activeSessions.set(doctorId, socket.userId);

    const doctorSocketId = onlineDoctors.get(doctorId);
    if (doctorSocketId) {
      console.log("doctor avilable online", doctorSocketId);
      io.to(doctorSocketId).emit("clientJoined", {
        roomId,
        clientId: socket.userId,
        clientName: client.name,
      });
    }

    callback?.({ success: true, roomId });
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

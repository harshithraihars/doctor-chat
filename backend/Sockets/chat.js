// server file
const jwt = require("jsonwebtoken");
const {
  onlineDoctors,
  activeSessions,
  onlineClients,
} = require("./onlineUsers");
const User = require("../models/User");
const Doctor = require("../models/Doctor");

function registerChatHandlers(io, socket) {
  socket.on("chatRequest", async ({ doctorId, clientId }) => {
    try {
      
      const client = await User.findById(socket.userId).select("name");

      if (!client) return socket.emit("error",{msg:"no records available un authorized acccess"});

      const doctorSocketId = onlineDoctors.get(doctorId);
      
      if (doctorSocketId) {
        io.to(doctorSocketId).emit("chatRequestReceived", {
          clientId,
          clientName: client.name,
        });
      } else {
        
        socket.emit("chatRequestFailed", {
          msg: "Doctor is offline. Please try again later.or try onnecting offline",
          doctorId,
        });
      }
    } catch (error) {
      socket.emit("error", { msg: error.message || "someting went wrong" });
    }
  });

  socket.on("chatResponse", async ({ clientId, accepted }, callback) => {
    try {
      const clientSocketId = onlineClients.get(clientId);

      if (!clientSocketId) return;

      if (!accepted) {
        io.to(clientSocketId).emit("chatRejected", { doctorId: socket.userId });
        return callback?.({ success: true, message: "Rejected" });
      }

      const roomId = `room-${[clientId, socket.userId].sort().join("-")}`;

      // save active session both ways
      activeSessions.set(clientId, socket.userId);
      activeSessions.set(socket.userId, clientId);

      // join both sockets into the room
      socket.join(roomId);
      io.sockets.sockets.get(clientSocketId)?.join(roomId);

      const doctor = await Doctor.findById(socket.userId).select("name");

      const client = await User.findById(clientId).select("name");
      // notify both sides
      io.to(clientSocketId).emit("chatAccepted", {
        roomId,
        doctorId: socket.userId,
        role: "client",
        doctorName: doctor.name,
      });

      // For doctor
      io.to(socket.id).emit("chatAccepted", {
        roomId,
        clientId,
        role: "doctor",
        clientName: client.name,
      });

      callback?.({ success: true, roomId });
    } catch (error) {
      return callback?.({ success: false });
    }
  });

  socket.on("disconnect", () => {
    console.log("disconnected");

    if (socket.userId) {
      onlineDoctors.delete(socket.userId)
      // onlineUsers.delete(socket.userId);
      io.emit("doctor:offline", socket.userId);
    }
  });
}

module.exports = registerChatHandlers;

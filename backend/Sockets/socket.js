const Doctor = require("../models/Doctor");

const userSocketMap = new Map(); // userId → socketId
const socketUserMap = new Map(); // socketId → { id, role, name }
const doctorClientMap = new Map(); // doctorId → Set of userIds
const specializationMap = new Map();
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    socket.on("Client-login", ({ id, role, name }) => {
      userSocketMap.set(id, socket.id);
      socketUserMap.set(socket.id, { id, role, name });

      console.log(` ${role} connected: ${name} (${id})`);
    });

    socket.on("Doctor-login", async ({ id }) => {
      const doc = await Doctor.findOne({ docId: id });
      console.log("doctor loggedin");
      
      if (doc) {
        userSocketMap.set(id, socket.id);
        socketUserMap.set(socket.id, {
          id,
          role: doc.specialization,
          name: doc.name,
        });

        console.log(`🩺 Doctor logged in: ${doc.name} (${doc.specialization})`);
      }
    });

    // When a user requests a doctor of a specific specialization
    socket.on("specialization", ({ specialization, userId }) => {
      const availableDoctors = [];

      for (const [sockId, user] of socketUserMap.entries()) {
        if (user.role === specialization) {
          availableDoctors.push({ sockId, user });
        }
      }

      if (availableDoctors.length === 0) {
        return socket.emit("doctor-id", {
          error: "No doctor online for this specialization",
        });
      }

      availableDoctors.sort((a, b) => {
        const aClients = doctorClientMap.get(a.user.id)?.size || 0;
        const bClients = doctorClientMap.get(b.user.id)?.size || 0;
        return aClients - bClients;
      });

      const selected = availableDoctors[0]; // least busy doctor

      if (!doctorClientMap.has(selected.user.id)) {
        doctorClientMap.set(selected.user.id, new Set());
      }
      doctorClientMap.get(selected.user.id).add(userId);

      socket.emit("doctor-id", {
        role: specialization,
        name: selected.user.name,
        sockId:selected.sockId
      });
    });

    socket.on("send-message", ({ toId, message, fromId, senderName }) => {
      console.log(toId,message,fromId,senderName);
      
      const toSocketId = userSocketMap.get(toId);
      if (toId) {
        io.to(toId).emit("receive-message", {
          message,
          fromId,
          senderName,
        });

        // Track the conversation if the receiver is a doctor
        const receiver = socketUserMap.get(toSocketId);
        if (receiver?.role !== "patient") {
          if (!doctorClientMap.has(toId)) {
            doctorClientMap.set(toId, new Set());
          }
          doctorClientMap.get(toId).add(fromId);
        }
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      const user = socketUserMap.get(socket.id);
      if (!user) return;

      userSocketMap.delete(user.id);
      socketUserMap.delete(socket.id);

      // If a doctor disconnected, remove all their clients
      if (user.role !== "patient") {
        doctorClientMap.delete(user.id);
      } else {
        // If a user disconnected, remove them from all doctors’ client sets
        for (const clients of doctorClientMap.values()) {
          clients.delete(user.id);
        }
      }

      console.log(" Disconnected:", socket.id);
    });
  });
};

const Doctor = require("../models/Doctor");

const userSocketMap = new Map(); // userId → socketId
const socketUserMap = new Map(); // socketId → { id, role, name }
const doctorClientMap = new Map(); // doctorId → Set of userIds
const availabeSpecializiation = new Set();
const peerMap = new Map();
module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("Client-login", ({ id, role, name }) => {
      userSocketMap.set(id, socket.id);
      socketUserMap.set(socket.id, { id, role, name });

      console.log(` ${role} connected: ${name} (${id})`);

      setTimeout(() => {
        socket.emit("available-doctors", [...availabeSpecializiation]);
      }, 100);
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
        availabeSpecializiation.add(doc.specialization);
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
      console.log(peerMap);
      console.log(selected.sockId);
      
      
      
      if (
        peerMap.get(selected.sockId) &&
        peerMap.get(selected.sockId)?.size > 5
      ) {
        return socket.emit("doctor-id", {
          error: "All Doctors are Busy Please wait",
        });
      }

      if (!doctorClientMap.has(selected.user.id)) {
        doctorClientMap.set(selected.user.id, new Set());
      }
      doctorClientMap.get(selected.user.id).add(userId);

      socket.emit("doctor-id", {
        role: specialization,
        name: selected.user.name,
        sockId: selected.sockId,
      });
    });

    socket.on("send-message", ({ toId, message, fromId, senderName }) => {
      // set up peerconnection who is connected to who helps in disconnection
      if (!peerMap.has(fromId)) peerMap.set(fromId, new Set());
      if (!peerMap.has(toId)) peerMap.set(toId, new Set());
      peerMap.get(fromId).add(toId);
      peerMap.get(toId).add(fromId);

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

      // send the peer disconnected message to all th other peers connected to it
      const peersConnected = peerMap.get(socket.id);
      if (peersConnected) {
        for (const peerSocketId of peersConnected) {
          const peerSocket = io.sockets.sockets.get(peerSocketId);
          if (peerSocket) {
            peerSocket.emit("peer-disconnected", {
              peerId: socket.id,
            });
          }

          // remove the peersocket from map because the connection is added in the map two times
          const peerSet = peerMap.get(peerSocketId);
          if (peerSet) {
            peerSet.delete(socket.id);
          }
        }

        peerMap.delete(socket.id);
      }
    });
  });
};

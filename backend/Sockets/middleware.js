const jwt = require("jsonwebtoken");
const {onlineClients,onlineDoctors,activeSessions}=require("./onlineUsers")
function socketAuth(socket, next) {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) return next(new Error("Authentication error"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "xxxyyy");

    socket.userId = decoded.userId;
    socket.role = decoded.role;
    
    
    if (decoded.role === "doctor") onlineDoctors.set(decoded.userId, socket.id);
    else onlineClients.set(decoded.userId, socket.id);    
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
}

module.exports = { socketAuth};

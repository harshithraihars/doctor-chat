const jwt = require("jsonwebtoken");
const {onlinelients,onlineDoctors,activeSessions}=require("./onlineUsers")
function socketAuth(socket, next) {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) return next(new Error("Authentication error"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "xxxyyy");

    socket.userId = decoded.userId;
    socket.role = decoded.role;
    console.log(onlineDoctors);
    
    if (decoded.role === "doctor") onlineDoctors.set(decoded.userId, socket.id);
    else onlinelients.set(decoded.userId, socket.id);    
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
}

module.exports = { socketAuth, onlinelients };

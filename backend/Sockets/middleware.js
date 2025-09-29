const jwt = require("jsonwebtoken");
const onlineUsers = require("./onlineUsers");

function socketAuth(socket, next) {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) return next(new Error("Authentication error"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "xxxyyy");
    socket.userId = decoded.userId;
    onlineUsers.set(decoded.userId, socket.id); // register online
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
}

module.exports = { socketAuth, onlineUsers };

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoute");
const docrouter = require("./routes/docRoute");
const chatbotRoute = require("./routes/chatbotRoute");
const consulationRoute=require("./routes/consultationRoute")

const {socketAuth}=require("./Sockets/middleware")

const app = express();
const http = require("http").createServer(app);

const registerChatHandlers = require("./Sockets/chat");
require("dotenv").config({});

const allowedOrigins = [process.env.CORS_ORIGIN, "http://localhost:5173"];

const io = require("socket.io")(http, {
  cors: {
    // origin: [process.env.CLIENT_URL, "http://localhost:5173"],
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// middlewear for socket io
io.use(socketAuth);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // register chat related events
  registerChatHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/doctor", docrouter);
app.use("/api/socket",consulationRoute);
app.use("/api/chatbot", chatbotRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => console.log("Server running on port 5000"));

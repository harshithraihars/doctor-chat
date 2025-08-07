const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoute");
const docrouter = require("./routes/docRoute");
const chatbotRoute = require("./routes/chatbotRoute");

const setUpSocket = require("./Sockets/socket");
const app = express();
const http = require("http").createServer(app);
require("dotenv").config({});

const allowedOrigins=[process.env.CORS_ORIGIN,"http://localhost:5173"]
const io = require("socket.io")(http, {
  cors: {
    origin: [process.env.CLIENT_URL,"http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/doctor", docrouter);
app.use("/api/chatbot", chatbotRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

setUpSocket(io);
const PORT = process.env.PORT || 5000;
http.listen(PORT, () => console.log("Server running on port 5000"));

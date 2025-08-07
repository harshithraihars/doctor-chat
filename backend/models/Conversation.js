const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["user", "bot"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String },
  messages: [messageSchema],
}, { timestamps: true });

module.exports = mongoose.model("Conversation", conversationSchema);

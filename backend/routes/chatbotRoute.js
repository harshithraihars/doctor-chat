const express = require("express");
const router = express.Router();
const { sendMessage, getConversation,getUserConversations } = require("../Controller/chatbotController");
const auth = require("../middleware/auth")

router.post("/message", auth, sendMessage);
router.get("/conversation/:conversationId", auth, getConversation);
router.get("/history", auth, getUserConversations);
module.exports = router;
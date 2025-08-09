const Conversation = require("../models/Conversation");
const {
  sendToGrok,
  generateConversationTitle,
} = require("../utils/grokClient");

exports.sendMessage = async (req, res) => {
  const { message, conversationId } = req.body;
  const userId = req.user.userId;

  let title=null
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation)
        return res.status(404).json({ error: "Conversation not found" });
    } else {
      // Generate title from first message
      title = await generateConversationTitle(message);

      conversation = new Conversation({
        userId,
        messages: [],
        title,
      });
    }

    const previousMessages = Array.isArray(conversation.messages)
      ? conversation.messages.slice(-6).map((msg) => ({
          sender: msg.sender,
          text: msg.content,
        }))
      : [];

    const botReply = await sendToGrok(previousMessages, message);

    conversation.messages.push({ sender: "user", content: message });
    conversation.messages.push({ sender: "bot", content: botReply });

    await conversation.save();

    res.json({ conversationId: conversation._id, botReply,title });
  } catch (err) {
    console.log(err.message);
    
    res.status(500).json({ error: err.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const convo = await Conversation.findById(req.params.conversationId);
    if (!convo)
      return res.status(404).json({ error: "Conversation not found" });
    res.json(convo);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
};

exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.user.userId;

    const conversations = await Conversation.find({ userId }).sort({
      updatedAt: -1,
    });

    const summary = conversations.map((conv) => ({
      conversationId: conv._id,
      title: conv.title || "Untitled chat",
      updatedAt: conv.updatedAt,
    }));

    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch conversation history" });
  }
};

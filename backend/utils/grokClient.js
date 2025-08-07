const axios = require("axios");

const SYSTEM_PROMPT = `
You are a highly knowledgeable and responsible healthcare assistant chatbot designed for a healthcare app.

Your role is to respond strictly to medical and health-related questions (e.g., symptoms, medications, diseases, treatments, lifestyle advice, mental health).

You MUST:

- Respond in a clear, concise, and structured format using Markdown (### headings, bullet points).
- Keep responses **brief** unless the user specifically asks to "explain more", "give details", or "elaborate".
- Include a short disclaimer at the end:  
  *“This is not a medical diagnosis. Please consult a doctor for confirmation.”*
- Politely decline to answer non-health-related questions (e.g., tech, sports, entertainment) with:  
  *“I’m here to help with health-related questions only. Please ask something related to your health.”*
`;


const TITLE_PROMPT = `
You are a system that generates a short title for a user's health-related question.
The title should be concise (max 6 words), descriptive, and relevant to the user's first message.

Examples:
- "Managing Type 2 Diabetes"
- "Home Remedies for Headache"
- "Dealing with Anxiety"

Only respond with the title. No extra text.
`;

// Pass the last 6 messages from MongoDB + the new user message
exports.sendToGrok = async (conversationMessages = [], newMessage) => {
  try {
    // Slice last 6 messages from conversation
    const recentHistory = conversationMessages.slice(-6).map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    }));

    // Construct messages array
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...recentHistory,
      { role: "user", content: newMessage },
    ];

    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages,
        temperature: 0.7,
        max_tokens: 200,
        top_p: 1,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data.choices[0].message.content;
  } catch (error) {
    console.error("Grok API Error:", error.response?.data || error.message);
    throw new Error("Grok API failed");
  }
};


exports.generateConversationTitle = async (firstMessage) => {
  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          { role: "system", content: TITLE_PROMPT },
          { role: "user", content: firstMessage },
        ],
        temperature: 0.5,
        max_tokens: 20,
        top_p: 1,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res.data.choices[0].message.content.trim());
    
    return res.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Grok title generation failed:", error.message);
    return "Untitled";
  }
};

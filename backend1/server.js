require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Server is working 🚀");
});

// ✅ AI API using OpenRouter (FREE)
app.post("/analyze", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo", // free model
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant. Give short, clear answers."
          },
          {
            role: "user",
            content: message
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ AI RESPONSE:", response.data);

    res.json({
      reply: response.data.choices[0].message.content
    });

  } catch (error) {
    console.log("❌ ERROR:", error.response?.data || error.message);

    res.json({
      reply: "Error from AI ❌"
    });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
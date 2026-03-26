require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Server is working 🚀");
});

// MAIN API
app.post("/analyze", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    const aiResponse =
      data.choices?.[0]?.message?.content || "No response from AI";

    res.json({
      reply: aiResponse
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      reply: "Server error"
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

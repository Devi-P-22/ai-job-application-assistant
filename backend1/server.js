require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Server is working");
});

// MAIN API
app.post("/analyze", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        // safer free model
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "user",
            content: message
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Debug log (helps if error)
    console.log("AI FULL RESPONSE:", response.data);

    const aiResponse =
      response.data.choices?.[0]?.message?.content ||
      "No response from AI";

    res.json({
      reply: aiResponse
    });

  } catch (error) {
    console.log("ERROR:", error.response?.data || error.message);

    res.status(500).json({
      reply: "Server error"
    });
  }
});

// IMPORTANT for deployment
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

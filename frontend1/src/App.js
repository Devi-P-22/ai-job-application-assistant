import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);

  const sendMessage = async () => {
    if (!message) return;

    const newChat = [...chat, { type: "user", text: message }];
    setChat(newChat);
    setMessage("");
    setLoading(true);

    const res = await fetch("https://your-render-url.onrender.com/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    setChat([
      ...newChat,
      { type: "bot", text: data.reply }
    ]);

    setLoading(false);
  };

  return (
    <div className={dark ? "main dark" : "main"}>
      <div className="card">

        {/* Header */}
        <div className="header">
          <h1>🤖 AI Assistant</h1>
          <button className="toggle" onClick={() => setDark(!dark)}>
            {dark ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Chat */}
        <div className="chat">
          {chat.map((msg, i) => (
            <div key={i} className={msg.type}>
              {msg.type === "user" ? "🧑 " : "🤖 "}
              {msg.text}
            </div>
          ))}

          {loading && <div className="bot typing">🤖 Typing...</div>}
        </div>

        {/* Input */}
        <div className="inputBox">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask anything..."
          />
          <button onClick={sendMessage}>➤</button>
        </div>

      </div>
    </div>
  );
}

export default App;

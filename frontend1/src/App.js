import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);

  const chatEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  // Typing effect
  const typeText = (text, callback) => {
    let index = 0;
    let current = "";

    const interval = setInterval(() => {
      if (index < text.length) {
        current += text[index];
        callback(current);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    const newChat = [...chat, { type: "user", text: userMessage }];
    setChat(newChat);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("https://ai-job-application-assistantt1.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      // Add empty bot message first
      setChat([...newChat, { type: "bot", text: "" }]);
      setLoading(false);

      // Typing animation
      typeText(data.reply, (updatedText) => {
        setChat((prevChat) => {
          const updated = [...prevChat];
          updated[updated.length - 1].text = updatedText;
          return updated;
        });
      });

    } catch (error) {
      setLoading(false);
      setChat([...newChat, { type: "bot", text: "⚠️ Error connecting to server" }]);
    }
  };

  // Enter key send
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
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
            <div key={i} className={`msg ${msg.type}`}>
              {msg.type === "user" ? "🧑 " : "🤖 "}
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="msg bot typing">
              🤖 <span className="dots"></span>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Input */}
        <div className="inputBox">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
          />
          <button onClick={sendMessage}>➤</button>
        </div>

      </div>
    </div>
  );
}

export default App;

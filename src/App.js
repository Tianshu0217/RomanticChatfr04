import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    {
      sender: "WittyRomanceAI",
      text:
        "Hello, I’m your AI companion, here to provide attentive, thoughtful support and clear guidance. You can share your recent challenges or concerns with me, and I will respond with professionalism, empathy, and practical insights. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: input })  // ✅ FIXED
      });

      const data = await response.json();  // ✅ FIXED
      const botMsg = {
        sender: "WittyRomanceAI",
        text: data.response || "No response from server",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "WittyRomanceAI", text: "Oops! Server error." },
      ]);
    }
  };

  useEffect(() => {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="App">
      <h1>Chat with AI</h1>
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            <strong>{msg.sender === "user" ? "You" : "WittyRomanceAI"}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;

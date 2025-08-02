import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    {
      sender: "AI",
      text:
        "Welcome back! Let’s continue our chat.",
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
        sender: "AI",
        text: data.response || "No response from server",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "AI", text: "Oops! Server error." },
      ]);
    }
  };

  useEffect(() => {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="App">
      <h1>Let's chat</h1>
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            <strong>{msg.sender === "user" ? "You" : "AI"}:</strong> {msg.text}
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

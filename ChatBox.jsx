// ChatBox.jsx
//
// A chat-style interface for the RAG search feature. Instead of a plain
// search bar returning a list, this keeps a running conversation thread:
// each question and its matched session notes appear as chat bubbles.
//
// Uses searchSessionNotes() from api.js under the hood — same backend
// call as before, different presentation.

import { useState, useRef, useEffect } from "react";
import { searchSessionNotes } from "../api";

function ChatBox() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Ask me about any student's session history, e.g. \"who struggled with fractions\"." }
  ]);
  const [inputText, setInputText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const threadEndRef = useRef(null);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const question = inputText.trim();
    if (!question) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInputText("");
    setIsSearching(true);

    try {
      const results = await searchSessionNotes(question);

      const responseText = results.length
        ? results
            .map((r) => `Student ${r.student_id} (${(r.similarity_score * 100).toFixed(0)}% match): ${r.notes}`)
            .join("\n\n")
        : "No matching session notes found.";

      setMessages((prev) => [...prev, { role: "assistant", text: responseText }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", text: `Search failed: ${error.message}` }]);
    } finally {
      setIsSearching(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div style={{ fontFamily: "'Georgia', serif", display: "flex", flexDirection: "column", height: "480px", border: "1px solid #ded7c9", borderRadius: "8px", overflow: "hidden" }}>
      <div style={{ background: "#2b2620", color: "#f4f1ea", padding: "12px 16px", fontSize: "14px", fontWeight: 500 }}>
        Search session notes
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px", background: "#faf8f3" }}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: message.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "10px"
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                whiteSpace: "pre-wrap",
                padding: "10px 14px",
                borderRadius: "10px",
                fontSize: "14px",
                lineHeight: 1.5,
                background: message.role === "user" ? "#c96f4a" : "#ede8dc",
                color: message.role === "user" ? "#fff" : "#2b2620"
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isSearching && (
          <div style={{ fontSize: "13px", color: "#8a8272" }}>Searching notes...</div>
        )}
        <div ref={threadEndRef} />
      </div>

      <div style={{ display: "flex", borderTop: "1px solid #ded7c9", background: "#fff" }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about a student's session history..."
          style={{ flex: 1, border: "none", padding: "12px 14px", fontSize: "14px", outline: "none" }}
        />
        <button
          onClick={handleSend}
          disabled={isSearching}
          style={{ border: "none", background: "#2b2620", color: "#fff", padding: "0 20px", cursor: "pointer" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Chatbot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm your marketing strategy assistant. Ask me anything about improving your social media performance." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("https://competitor-intelligence-engine1.onrender.com/chat", { message: input });
      const botReply = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, I couldn't connect to the AI service. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col px-4 py-8 md:px-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-400">AI Strategy Assistant 🤖</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-700 hover:bg-gray-600 transition px-4 py-2 rounded-lg text-sm"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="flex-1 bg-gray-800 rounded-xl p-5 overflow-y-auto max-h-[60vh] mb-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-md px-4 py-3 rounded-2xl text-sm ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-100"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-300 px-4 py-3 rounded-2xl text-sm italic">
              Typing...
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask for a suggestion..."
          className="flex-1 p-3 rounded-lg bg-gray-800 text-white outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 transition px-6 py-3 rounded-lg font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
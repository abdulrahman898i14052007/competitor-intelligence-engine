import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username.trim() === "") return;
    try {
      await axios.post("https://competitor-intelligence-engine1.onrender.com/signup", { username });
    } catch (err) {
      console.log("Signup API error, continuing anyway:", err);
    }
    localStorage.setItem("username", username);
    navigate("/welcome");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-400">Competitor Intelligence Engine</h1>
        <p className="text-gray-400 mt-2">Smart insights for your social media strategy</p>
      </div>

      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <label className="block text-sm text-gray-300 mb-2">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none mb-2"
        />
        <p className="text-xs text-gray-500 mb-4">
          This username is used to identify your account within the app.
        </p>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 transition text-white font-semibold py-3 rounded-lg"
        >
          Continue
        </button>
      </form>
    </div>
  );
}

export default Login;
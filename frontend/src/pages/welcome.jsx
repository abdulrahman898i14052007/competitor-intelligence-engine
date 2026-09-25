import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("username");
    if (!saved) {
      navigate("/");
    } else {
      setUsername(saved);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-4xl font-bold text-blue-400 mb-2">
        Welcome, {username}! 👋
      </h1>
      <p className="text-gray-400 mb-8">
        Let's choose a platform to start analyzing.
      </p>
      <button
        onClick={() => navigate("/platform")}
        className="bg-blue-500 hover:bg-blue-600 transition text-white font-semibold px-8 py-3 rounded-lg"
      >
        Get Started
      </button>
    </div>
  );
}

export default Welcome;
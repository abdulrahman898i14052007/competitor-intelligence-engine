import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CompetitorInput() {
  const navigate = useNavigate();
  const [competitorId, setCompetitorId] = useState("");
  const [competitors, setCompetitors] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("competitors") || "[]");
    setCompetitors(saved);
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!competitorId.trim()) return;
    const username = localStorage.getItem("username") || "guest";
    try {
      await axios.post("https://competitor-intelligence-engine1.onrender.com/add-competitor", {
        username,
        competitor_id: competitorId.trim(),
      });
    } catch (err) {
      console.log("Add-competitor API error, continuing anyway:", err);
    }
    const updated = [...competitors, competitorId.trim()];
    setCompetitors(updated);
    localStorage.setItem("competitors", JSON.stringify(updated));
    setCompetitorId("");
  };

  const handleRemove = (name) => {
    const updated = competitors.filter((c) => c !== name);
    setCompetitors(updated);
    localStorage.setItem("competitors", JSON.stringify(updated));
  };

  const handleCompare = (name) => {
    localStorage.setItem("competitorId", name);
    navigate("/comparison");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-400 mb-2">
        Manage Competitors
      </h1>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        Add multiple competitors and compare your performance against each
      </p>

      <form onSubmit={handleAdd} className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md mb-6">
        <label className="block text-sm text-gray-300 mb-2">Competitor Instagram ID</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={competitorId}
            onChange={(e) => setCompetitorId(e.target.value)}
            placeholder="@competitor_username"
            className="flex-1 p-3 rounded-lg bg-gray-700 text-white outline-none"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 transition text-white font-semibold px-5 rounded-lg"
          >
            Add
          </button>
        </div>
      </form>

      <div className="w-full max-w-md space-y-3">
        {competitors.length === 0 && (
          <p className="text-gray-500 text-center text-sm">No competitors added yet</p>
        )}
        {competitors.map((c) => (
          <div
            key={c}
            className="bg-gray-800 p-4 rounded-xl flex justify-between items-center"
          >
            <span className="font-medium">@{c}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleCompare(c)}
                className="bg-blue-500 hover:bg-blue-600 transition text-sm px-3 py-1.5 rounded-lg"
              >
                Compare
              </button>
              <button
                onClick={() => handleRemove(c)}
                className="bg-red-500/80 hover:bg-red-600 transition text-sm px-3 py-1.5 rounded-lg"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompetitorInput;
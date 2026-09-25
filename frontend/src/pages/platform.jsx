import { useNavigate } from "react-router-dom";
import { Camera, Share2, MessageCircle } from "lucide-react";

function Platform() {
  const navigate = useNavigate();

  const platforms = [
    { name: "Instagram", icon: Camera, path: "/connect/instagram", available: true },
    { name: "Facebook", icon: Share2, path: "/connect/facebook", available: false },
    { name: "Threads", icon: MessageCircle, path: "/connect/threads", available: false },
  ];

  const handleSelect = (platform) => {
    if (!platform.available) return;
    navigate(platform.path);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-3xl font-bold text-blue-400 mb-2">
        Choose a Platform
      </h1>
      <p className="text-gray-400 mb-10">
        Select the Meta platform you'd like to analyze
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl">
        {platforms.map((p) => (
          <button
            key={p.name}
            onClick={() => handleSelect(p)}
            className={`flex flex-col items-center justify-center p-8 rounded-2xl border transition
              ${p.available
                ? "bg-gray-800 border-gray-700 hover:border-blue-400 cursor-pointer"
                : "bg-gray-800/50 border-gray-800 cursor-not-allowed opacity-50"}`}
          >
            <p.icon size={40} className="mb-3 text-blue-400" />
            <span className="font-semibold">{p.name}</span>
            {!p.available && (
              <span className="text-xs text-gray-500 mt-1">Coming soon</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Platform;
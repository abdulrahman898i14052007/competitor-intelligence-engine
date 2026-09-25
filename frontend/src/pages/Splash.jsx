import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Radar } from "lucide-react";

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="animate-pulse flex flex-col items-center">
        <div className="bg-blue-500/20 p-6 rounded-3xl mb-5">
          <Radar size={56} className="text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold text-blue-400 tracking-wide">
          Competitor Intelligence Engine
        </h1>
        <p className="text-gray-500 text-sm mt-2">Smart insights for your growth</p>
      </div>
    </div>
  );
}

export default Splash;
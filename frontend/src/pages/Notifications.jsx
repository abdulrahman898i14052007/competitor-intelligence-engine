import { useNavigate } from "react-router-dom";
import { Bell, TrendingUp, Award } from "lucide-react";

const mockNotifications = [
  {
    type: "competitor",
    icon: TrendingUp,
    color: "text-yellow-400",
    title: "Competitor Alert",
    message: "@mee_on_the_waay's engagement rate jumped 18% this week. Check their latest Reels.",
    time: "2 hours ago",
  },
  {
    type: "self",
    icon: Award,
    color: "text-green-400",
    title: "Great Progress! 🎉",
    message: "Your engagement rate improved by 6% compared to last week. Keep it up!",
    time: "5 hours ago",
  },
  {
    type: "competitor",
    icon: TrendingUp,
    color: "text-yellow-400",
    title: "Competitor Alert",
    message: "A competitor increased posting frequency to 5 posts/week. Consider matching their cadence.",
    time: "1 day ago",
  },
  {
    type: "self",
    icon: Award,
    color: "text-green-400",
    title: "Milestone Reached! 🚀",
    message: "You crossed 15,000 followers. Your Reels are performing best — keep posting more!",
    time: "2 days ago",
  },
];

function Notifications() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8 md:px-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Bell className="text-blue-400" size={26} />
          <h1 className="text-2xl font-bold text-blue-400">Notifications</h1>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-700 hover:bg-gray-600 transition px-4 py-2 rounded-lg text-sm"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        {mockNotifications.map((n, i) => (
          <div key={i} className="bg-gray-800 p-5 rounded-xl flex gap-4 items-start">
            <n.icon className={n.color} size={24} />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold">{n.title}</h3>
                <span className="text-xs text-gray-500">{n.time}</span>
              </div>
              <p className="text-gray-300 text-sm">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
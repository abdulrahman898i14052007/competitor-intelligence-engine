import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import { userProfile as fallbackProfile } from "../data/mockData";
import {
  avgEngagementRate, postingFrequency, contentDistribution, bestContentType, calcEngagementRate, calendarPattern,
} from "../utils/analytics";

const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171"];

function Dashboard() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(fallbackProfile);

  useEffect(() => {
    const igProfile = JSON.parse(localStorage.getItem("igProfile") || "{}");
    const handle = igProfile.igId?.replace("@", "") || "your_brand";

    axios.get(`https://competitor-intelligence-engine1.onrender.com/profile-data/${handle}`)
      .then((res) => {
        if (res.data.found) {
          setUserProfile({
            username: res.data.handle,
            followers: res.data.followers,
            totalPosts: res.data.total_posts,
            posts: res.data.posts.map((p) => ({
              date: p.date, type: p.type, captionLength: p.captionLength,
              hashtags: p.hashtags, likes: p.likes, comments: p.comments, shares: p.shares,
            })),
          });
        }
      })
      .catch(() => console.log("Using fallback mock data"));
  }, []);

  const { posts, followers, username, totalPosts } = userProfile;

  const engagementTrend = posts.map((p) => ({
    date: p.date.slice(5),
    engagement: parseFloat(calcEngagementRate(p, followers)),
  }));

  const distribution = contentDistribution(posts);
  const calendarData = calendarPattern(posts, followers);
  const maxEngagement = Math.max(...calendarData.map((d) => d.engagement), 1);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8 md:px-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-blue-400">@{username}</h1>
          <p className="text-gray-400 text-sm">Your Profile Analysis</p>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => navigate("/notifications")}
            className="bg-gray-700 hover:bg-gray-600 transition p-2.5 rounded-lg"
          >
            🔔
          </button>
          <button
            onClick={() => navigate("/chatbot")}
            className="bg-gray-700 hover:bg-gray-600 transition px-5 py-2 rounded-lg font-semibold"
          >
            AI Assistant
          </button>
          <button
            onClick={() => navigate("/competitor")}
            className="bg-blue-500 hover:bg-blue-600 transition px-5 py-2 rounded-lg font-semibold"
          >
            Compare Competitor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 p-5 rounded-xl">
          <p className="text-gray-400 text-sm">Followers</p>
          <p className="text-2xl font-bold">{followers.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 p-5 rounded-xl">
          <p className="text-gray-400 text-sm">Total Posts</p>
          <p className="text-2xl font-bold">{totalPosts}</p>
        </div>
        <div className="bg-gray-800 p-5 rounded-xl">
          <p className="text-gray-400 text-sm">Posting Frequency</p>
          <p className="text-2xl font-bold">{postingFrequency(posts)}/week</p>
        </div>
        <div className="bg-gray-800 p-5 rounded-xl">
          <p className="text-gray-400 text-sm">Avg Engagement</p>
          <p className="text-2xl font-bold">{avgEngagementRate(posts, followers)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 p-5 rounded-xl">
          <h2 className="font-semibold mb-4">Engagement Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={engagementTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
              <Line type="monotone" dataKey="engagement" stroke="#60a5fa" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-5 rounded-xl">
          <h2 className="font-semibold mb-4">Content Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={distribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {distribution.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-800 p-5 rounded-xl mb-8">
        <h2 className="font-semibold mb-4">Recent Posts Breakdown</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={posts.map((p) => ({ ...p, date: p.date.slice(5) }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
            <Legend />
            <Bar dataKey="likes" fill="#60a5fa" />
            <Bar dataKey="comments" fill="#34d399" />
            <Bar dataKey="shares" fill="#fbbf24" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-800 p-5 rounded-xl mb-8">
        <h2 className="font-semibold mb-4">Calendar Pattern — Best Days to Post</h2>
        <div className="grid grid-cols-7 gap-2">
          {calendarData.map((d) => {
            const intensity = d.engagement / maxEngagement;
            return (
              <div key={d.day} className="flex flex-col items-center">
                <div
                  className="w-full aspect-square rounded-lg flex items-center justify-center text-xs font-semibold mb-1"
                  style={{ backgroundColor: `rgba(96, 165, 250, ${0.15 + intensity * 0.85})` }}
                >
                  {d.engagement > 0 ? `${d.engagement}%` : "-"}
                </div>
                <span className="text-gray-400 text-xs">{d.day}</span>
              </div>
            );
          })}
        </div>
        <p className="text-gray-500 text-xs mt-3">
          Darker cells indicate higher average engagement rate for that day
        </p>
      </div>

      <div className="bg-gray-800 p-5 rounded-xl">
        <p className="text-gray-400 text-sm">Best Performing Content Type</p>
        <p className="text-2xl font-bold text-blue-400">{bestContentType(posts, followers)}</p>
      </div>
    </div>
  );
}

export default Dashboard;

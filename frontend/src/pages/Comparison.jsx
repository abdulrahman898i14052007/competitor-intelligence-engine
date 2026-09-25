import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { userProfile as fallbackUser, competitorProfile as fallbackCompetitor } from "../data/mockData";
import { avgEngagementRate, postingFrequency, bestContentType } from "../utils/analytics";

function Comparison() {
  const navigate = useNavigate();
  const competitorId = localStorage.getItem("competitorId") || "competitor_brand";
  const [userProfile, setUserProfile] = useState(fallbackUser);
  const [competitorProfile, setCompetitorProfile] = useState(fallbackCompetitor);

  useEffect(() => {
    const igProfile = JSON.parse(localStorage.getItem("igProfile") || "{}");
    const userHandle = igProfile.igId?.replace("@", "") || "your_brand";
    const compHandle = competitorId.replace("@", "");

    axios.get(`https://competitor-intelligence-engine1.onrender.com/profile-data/${userHandle}`)
      .then((res) => {
        if (res.data.found) {
          setUserProfile({
            username: res.data.handle,
            followers: res.data.followers,
            posts: res.data.posts.map((p) => ({ likes: p.likes, comments: p.comments, shares: p.shares, type: p.type })),
          });
        }
      })
      .catch(() => console.log("Using fallback user data"));

    axios.get(`https://competitor-intelligence-engine1.onrender.com/profile-data/${compHandle}`)
      .then((res) => {
        if (res.data.found) {
          setCompetitorProfile({
            username: res.data.handle,
            followers: res.data.followers,
            posts: res.data.posts.map((p) => ({ likes: p.likes, comments: p.comments, shares: p.shares, type: p.type })),
          });
        }
      })
      .catch(() => console.log("Using fallback competitor data"));
  }, [competitorId]);

  const followersData = [
    { metric: "Followers", You: userProfile.followers, Competitor: competitorProfile.followers },
  ];

  const engagementData = [
    {
      metric: "Avg Engagement %",
      You: parseFloat(avgEngagementRate(userProfile.posts, userProfile.followers)),
      Competitor: parseFloat(avgEngagementRate(competitorProfile.posts, competitorProfile.followers)),
    },
  ];

  const frequencyData = [
    {
      metric: "Posts/Week",
      You: parseFloat(postingFrequency(userProfile.posts)),
      Competitor: parseFloat(postingFrequency(competitorProfile.posts)),
    },
  ];

  const recommendations = [
    `Post more Reels — @${competitorId} gets higher engagement with video content.`,
    `Increase posting frequency to match competitor's weekly cadence.`,
    `Use more hashtags (8-12) per post, similar to top competitor posts.`,
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8 md:px-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-blue-400">
          You vs @{competitorId}
        </h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-700 hover:bg-gray-600 transition px-4 py-2 rounded-lg text-sm"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 p-5 rounded-xl">
          <p className="text-gray-400 text-sm mb-1">Your Best Content Type</p>
          <p className="text-xl font-bold text-blue-400">
            {bestContentType(userProfile.posts, userProfile.followers)}
          </p>
        </div>
        <div className="bg-gray-800 p-5 rounded-xl">
          <p className="text-gray-400 text-sm mb-1">Competitor's Best Content Type</p>
          <p className="text-xl font-bold text-yellow-400">
            {bestContentType(competitorProfile.posts, competitorProfile.followers)}
          </p>
        </div>
      </div>

      <h2 className="font-semibold mb-4 text-lg">Performance Comparison</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-5 rounded-xl">
          <h3 className="font-semibold mb-4 text-sm text-gray-300">Followers</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={followersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="metric" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
              <Bar dataKey="You" fill="#60a5fa" />
              <Bar dataKey="Competitor" fill="#fbbf24" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-5 rounded-xl">
          <h3 className="font-semibold mb-4 text-sm text-gray-300">Avg Engagement %</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="metric" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
              <Bar dataKey="You" fill="#60a5fa" />
              <Bar dataKey="Competitor" fill="#fbbf24" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-5 rounded-xl">
          <h3 className="font-semibold mb-4 text-sm text-gray-300">Posts/Week</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={frequencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="metric" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
              <Bar dataKey="You" fill="#60a5fa" />
              <Bar dataKey="Competitor" fill="#fbbf24" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-800 p-5 rounded-xl">
        <h2 className="font-semibold mb-4 text-blue-400">AI Recommendations 🤖</h2>
        <ul className="space-y-3">
          {recommendations.map((rec, i) => (
            <li key={i} className="bg-gray-700 p-3 rounded-lg text-sm">
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Comparison;
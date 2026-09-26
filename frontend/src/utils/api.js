import axios from 'axios';

const BACKEND_URL = "https://competitor-intelligence-engine-2.onrender.com";

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. AI Chat
export async function chatWithAI(message) {
  try {
    const res = await api.post("/chat", { message });
    return res.data.reply;
  } catch (err) {
    return `Error: ${err.message}`;
  }
}

// 2. Profile Data (Fetches from SQLite database: SocialProfile & Post)
export async function getProfileData(handle) {
  try {
    const clean = handle.replace("@", "");
    const res = await api.get(`/profile-data/${clean}`);
    return res.data;
  } catch (err) {
    return { found: false, message: "Profile not in database" };
  }
}

// 3. User Signup
export async function signup(username) {
  try {
    const res = await api.post("/signup", { username });
    localStorage.setItem("username", username);
    return res.data;
  } catch (err) {
    // fallback if offline
    localStorage.setItem("username", username);
    return { message: "User created (offline)", username };
  }
}

// 4. Connect Profile
export async function connectProfile(profileData) {
  try {
    const res = await api.post("/connect-profile", profileData);
    localStorage.setItem("igProfile", JSON.stringify(profileData));
    return res.data;
  } catch (err) {
    localStorage.setItem("igProfile", JSON.stringify(profileData));
    return { message: "Profile connected locally" };
  }
}

// 5. Add Competitor
export async function addCompetitor(username, competitorId) {
  try {
    const res = await api.post("/add-competitor", {
      username,
      competitor_id: competitorId,
    });
    return res.data;
  } catch (err) {
    return { message: "Error adding competitor" };
  }
}

// 6. Get Competitors
export async function getCompetitors(username) {
  try {
    const res = await api.get(`/competitors/${username}`);
    return res.data;
  } catch (err) {
    return [];
  }
}

export default api;
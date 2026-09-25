/**
 * Centralized API module — replaces all backend calls.
 *
 * • Profile lookups  → local seed data
 * • User / competitor storage → localStorage
 * • AI chat → direct Groq REST API call from the browser
 */

import { seedProfiles } from "../data/mockData";

// ── Groq AI Chat ─────────────────────────────────────────────────────
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function chatWithAI(message) {
  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a social media marketing strategy assistant. Answer briefly and practically in 2-3 sentences.",
          },
          { role: "user", content: message },
        ],
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "No response from AI.";
  } catch (err) {
    return `Error: ${err.message}`;
  }
}

// ── Profile Data (replaces /profile-data/:handle) ────────────────────
export function getProfileData(handle) {
  const clean = handle.replace("@", "");
  const profile = seedProfiles[clean];
  if (!profile) {
    return { found: false, message: "Profile not in database" };
  }
  return {
    found: true,
    handle: profile.handle,
    display_name: profile.display_name,
    niche: profile.niche,
    followers: profile.followers,
    following: profile.following,
    total_posts: profile.total_posts,
    posts: profile.posts.map((p) => ({
      date: p.date,
      type: p.type,
      captionLength: p.captionLength,
      hashtags: p.hashtags,
      likes: p.likes,
      comments: p.comments,
      shares: p.shares,
    })),
  };
}

// ── User Signup (replaces /signup) ───────────────────────────────────
export function signup(username) {
  localStorage.setItem("username", username);
  return { message: "User created", username };
}

// ── Connect Profile (replaces /connect-profile) ─────────────────────
export function connectProfile(profileData) {
  localStorage.setItem("igProfile", JSON.stringify(profileData));
  return { message: "Profile connected successfully" };
}

// ── Add Competitor (replaces /add-competitor) ────────────────────────
export function addCompetitor(username, competitorId) {
  const existing = JSON.parse(localStorage.getItem("competitors") || "[]");
  if (!existing.includes(competitorId)) {
    existing.push(competitorId);
    localStorage.setItem("competitors", JSON.stringify(existing));
  }
  return { message: "Competitor added" };
}

// ── Get Competitors (replaces /competitors/:username) ────────────────
export function getCompetitors() {
  const comps = JSON.parse(localStorage.getItem("competitors") || "[]");
  return comps.map((id) => ({ competitor_id: id }));
}

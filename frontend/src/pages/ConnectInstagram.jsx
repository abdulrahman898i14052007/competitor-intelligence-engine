import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ConnectInstagram() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    igId: "",
    email: "",
    mobile: "",
    category: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.igId || !formData.email || !formData.mobile || !formData.category) {
      alert("Please fill all fields");
      return;
    }
    const username = localStorage.getItem("username") || "guest";
    try {
      await axios.post("https://competitor-intelligence-engine1.onrender.com/connect-profile", {
        username,
        platform: "Instagram",
        profile_id: formData.igId,
        email: formData.email,
        mobile: formData.mobile,
        category: formData.category,
      });
    } catch (err) {
      console.log("Connect-profile API error, continuing anyway:", err);
    }
    localStorage.setItem("igProfile", JSON.stringify(formData));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-400 mb-2">
        Connect Your Instagram
      </h1>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        We need a few details to analyze your profile and generate insights
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5"
      >
        <div>
          <label className="block text-sm text-gray-300 mb-1">Instagram ID</label>
          <input
            type="text"
            name="igId"
            value={formData.igId}
            onChange={handleChange}
            placeholder="@yourusername"
            className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Email ID</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Registered Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="+91 XXXXXXXXXX"
            className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Account Category</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg cursor-pointer flex-1">
              <input
                type="radio"
                name="category"
                value="Business"
                checked={formData.category === "Business"}
                onChange={handleChange}
              />
              Business
            </label>
            <label className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg cursor-pointer flex-1">
              <input
                type="radio"
                name="category"
                value="Content Creator"
                checked={formData.category === "Content Creator"}
                onChange={handleChange}
              />
              Content Creator
            </label>
            <label className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg cursor-pointer flex-1">
              <input
                type="radio"
                name="category"
                value="Other"
                checked={formData.category === "Other"}
                onChange={handleChange}
              />
              Other
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 transition text-white font-semibold py-3 rounded-lg"
        >
          Analyze My Profile
        </button>
      </form>
    </div>
  );
}

export default ConnectInstagram;
import { Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import Platform from "./pages/Platform";
import ConnectInstagram from "./pages/ConnectInstagram";
import Dashboard from "./pages/Dashboard";
import CompetitorInput from "./pages/CompetitorInput";
import Comparison from "./pages/Comparison";
import Chatbot from "./pages/Chatbot";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/platform" element={<Platform />} />
      <Route path="/connect/instagram" element={<ConnectInstagram />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/competitor" element={<CompetitorInput />} />
      <Route path="/comparison" element={<Comparison />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/notifications" element={<Notifications />} />
    </Routes>
  );
}

export default App;
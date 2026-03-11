import axios from "axios";

// Automatically use deployed backend if running on production (Vercel, Netlify, Render, etc)
// Fallback to localhost for local development
const isProduction = window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";
const API_BASE_URL = isProduction
  ? "https://nlp-virtual-lab-9ppy.onrender.com"
  : "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
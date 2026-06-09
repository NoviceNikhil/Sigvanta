// Centralized config — reads from Vite env vars with localhost fallbacks
// On Render static site, set VITE_API_BASE_URL to your backend URL (e.g., https://your-backend.onrender.com)

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

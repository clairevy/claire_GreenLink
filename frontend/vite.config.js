import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Vite config: proxy /api and /uploads to backend (default http://localhost:5000)
const target = process.env.VITE_API_BASE || "http://localhost:5000";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": { target, changeOrigin: true, secure: false },
      "/uploads": { target, changeOrigin: true, secure: false },
    },
  },
});

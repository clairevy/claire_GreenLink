import express, { request, response } from "express";
import productRouters from "./routes/productRouters.js";
import connectDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouters from "./routes/authRouters.js";
import userRouters from "./routes/userRouters.js";

import emailRouters from "./routes/emailRouters.js";
import postRouters from "./routes/postRouters.js";
import bidRouters from "./routes/bidRouters.js";
import supplyRouters from "./routes/supplyRouters.js";
import inventoryRouters from "./routes/inventoryRouters.js";
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cookieParser()); //middleware xu ly cookie
app.use(express.json()); //middleware xu ly json
// Configure CORS to allow credentials and restrict origins when credentials are used.
const frontendBase = process.env.FRONTEND_BASE_URL || "http://localhost:5173";
const allowedOrigins = [
  frontendBase,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://greenco-op-frontend.onrender.com", // Production frontend
];
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like curl, mobile apps, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS policy: This origin is not allowed"));
    },
    credentials: true,
  })
);
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// serve uploaded files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads");
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (err) {
  console.error("Failed to create uploads directory:", err);
}

app.use("/uploads", express.static(uploadsDir));

//connect database
connectDB();

// Health check endpoint for monitoring
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api/products", productRouters);

app.use("/api/auth", authRouters);
app.use("/api/user", userRouters);
app.use("/api/email", emailRouters);
app.use("/api/posts", postRouters);
app.use("/api/bids", bidRouters);
app.use("/api/supply", supplyRouters);
app.use("/api/inventory", inventoryRouters);
// Serve frontend static build (if present) so backend + frontend can run on one port
const clientDist = path.join(__dirname, "..", "..", "frontend", "dist");
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  // fallback to index.html for SPA routes
  app.get("*", (req, res) => {
    // don't override API routes
    if (req.path.startsWith("/api")) return res.status(404).end();
    res.sendFile(path.join(clientDist, "index.html"));
  });
}
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on("error", (err) => {
  if (err && err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Kill the process using that port or change the PORT environment variable.`
    );
    process.exit(1);
  }
  console.error("Server error:", err);
});

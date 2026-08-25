import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import stationRoutes from "./routes/stationRoutes.js";
import { ensureAdminSeed } from "./services/authService.js";
// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express application
const app = express();
ensureAdminSeed().catch((err) => {
  console.error("Admin seed error:", err);
});
// Allow requests from other websites
app.use(cors());

// Parse incoming JSON data
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Too many requests, please try again later.",
});

// Apply rate limiting
app.use(limiter);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/stations", stationRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;

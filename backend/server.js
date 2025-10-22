import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { connectDB } from "./config/database.js";
import { apiRateLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Global API rate limiting (opsional)
app.use("/api/", apiRateLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check route (without rate limiting)
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working!",
    timestamp: new Date().toISOString(),
  });
});

// Database connection
connectDB();

app.listen(PORT,"0.0.0.0", () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Backend URL: http://localhost:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(` Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
  console.log(` Rate limiting activated:`);
  console.log(`   - Login: 5 attempts per minute per IP`);
  console.log(`   - Register: 3 attempts per 15 minutes per IP`);
  console.log(`   - API: 100 requests per 15 minutes per IP`);
});

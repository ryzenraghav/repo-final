import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import passport from "passport";
import "./passport.js";
import authRoutes from "./authRoutes.js";

const app = express();


const PORT = process.env.PORT || 5002;

// Production-ready CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173", // Allow local development
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || !process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API is running", timestamp: new Date() });
});

app.use("/auth", authRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandle Error:", err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});


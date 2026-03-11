import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import passport from "passport";
import "./passport.js";
import authRoutes from "./authRoutes.js";
import evaluationRoutes from "./evaluationRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/api", evaluationRoutes);

app.listen(5002, () => {
  console.log("Backend running on http://localhost:5002");
});

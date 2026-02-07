import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import passport from "passport";
import "./passport.js";
import authRoutes from "./authRoutes.js";

const app = express();

app.use(cors());
app.use(passport.initialize());

app.use("/auth", authRoutes);

app.listen(5001, () => {
  console.log("Backend running on http://localhost:5001");
});

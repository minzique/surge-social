import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import cors from "cors";
import authRoutes from "@routes/auth.routes";
// import postRoutes from "@routes/post.routes";
import { config, validateConfig } from "./config/env.config";
import postRoutes from "./routes/post.routes";

validateConfig();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Database connection
mongoose
  .connect(config.mongodb.uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Start server
app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
  console.log(`Environment: ${config.server.nodeEnv}`);
});

export { app };
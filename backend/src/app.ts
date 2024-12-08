import express, {Express} from "express";

import mongoose from "mongoose";
import passport from "passport";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
// import postRoutes from "@routes/post.routes";
import { config, validateConfig } from "./config/env.config";
import postRoutes from "./routes/post.routes";

validateConfig();

const app: Express = express();
// CORS configuration
const corsOptions = {
  origin: config.server.nodeEnv === 'production' 
    ? config.server.clientUrl 
    : ['http://localhost:3000', 'http://localhost:5174', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  allowedOrigin: true,
  exposedHeaders: ['Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};
// Middleware
app.use(express.json());
app.use(cors(corsOptions));
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
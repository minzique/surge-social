import express, {Express} from "express";
import  connectDBWithRetry from "./config/mongoose.config";
import passport from "passport";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
// import postRoutes from "@routes/post.routes";
import { config, validateConfig } from "./config/env.config";
import postRoutes from "./routes/post.routes";
import { errorHandler } from './middleware/error-handler';

validateConfig();

const app: Express = express();
// CORS configuration
const corsOptions = {
  origin: config.server.nodeEnv === 'production' 
    ? config.server.clientUrl 
    : ['http://localhost:3000', 'http://localhost:5174', 'http://localhost:5173'],
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
connectDBWithRetry();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Global error handler - must be after routes
app.use(errorHandler as any);

// Start server
app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
  console.log(`Environment: ${config.server.nodeEnv}`);
});

export { app };
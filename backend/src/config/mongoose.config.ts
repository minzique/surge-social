import mongoose, { ConnectOptions } from "mongoose";
import { config } from "./env.config";

const connectDBWithRetry = async () => {
  try {
    await mongoose.connect(config.mongodb.uri, {
      dbName: config.mongodb.dbName,
    } as ConnectOptions);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    setTimeout(connectDBWithRetry, 5000);
    process.exit(1);
  }
};

export default connectDBWithRetry;


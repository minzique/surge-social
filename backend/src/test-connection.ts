import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Successfully connected to MongoDB.");

    // Create a test document
    const Test = mongoose.model("Test", new mongoose.Schema({ name: String }));
    await Test.create({ name: "test" });
    console.log("Successfully created test document.");

    // Clean up
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    console.log("Test complete. Connection closed.");
  } catch (error) {
    console.error("Connection test failed:", error);
    process.exit(1);
  }
}

testConnection();

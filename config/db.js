// Import packages we need
import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "dns";

// Load environment variables from .env file
dotenv.config();

// Use Google DNS for MongoDB SRV lookup
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Function to connect to MongoDB database
export async function connectDB() {
  // Get MongoDB connection URL from environment variables
  const url = process.env.MONGO_URL;

  // Check if URL exists
  if (!url) {
    console.error("MONGO_URL is missing. Please add it to your .env file.");
    throw new Error("Missing MongoDB URL");
  }

  try {
    // Try to connect to MongoDB
    await mongoose.connect(url);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Mongo connection error:", err.message);
    throw err;
  }
}

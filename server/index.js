import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug: Log environment info (remove after debugging)
console.log("🔍 Environment:", process.env.NODE_ENV);
console.log("🔍 MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("🔍 MONGO_URI length:", process.env.MONGO_URI?.length || 0);

// Health check / test route
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 API is running...",
    status: "healthy",
    environment: process.env.NODE_ENV,
    mongoConfigured: !!process.env.MONGO_URI
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    // Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI environment variable is not defined!");
    }

    // Check if it's a valid string
    if (typeof process.env.MONGO_URI !== 'string') {
      throw new Error("❌ MONGO_URI must be a string!");
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
};

connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
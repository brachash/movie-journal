// import express, { Request, Response } from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import rateLimit from 'express-rate-limit';
// import authRoutes from './routes/auth.routes';
// import movieRoutes from './routes/movie.routes';

// // Load environment variables from .env file
// dotenv.config();

// // Initialize Express application
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Rate limiting for authentication routes
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.',
// });

// // Middleware
// // Enable CORS for cross-origin requests
// app.use(cors());
// // Parse JSON request bodies
// app.use(express.json());

// // Apply rate limiting to auth routes
// app.use('/api/auth', authLimiter, authRoutes);
// app.use('/api/movies', movieRoutes);

// // Connect to MongoDB database
// mongoose
//   .connect(process.env.MONGO_URI || '', {})
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
// src/config.ts

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes";
import movieRoutes from "./routes/movie.routes";
import { config } from "./config";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/movies", movieRoutes);

// Connect to MongoDB
mongoose
  .connect(config.mongoUri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
});

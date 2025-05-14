import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth';
import movieRoutes from './routes/movies';

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
// Enable CORS for cross-origin requests
app.use(cors());
// Parse JSON request bodies
app.use(express.json());

// Apply rate limiting to auth routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/movies', movieRoutes);

// Connect to MongoDB database
mongoose
  .connect(process.env.MONGO_URI || '', {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

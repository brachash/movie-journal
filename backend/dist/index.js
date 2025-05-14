"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_1 = __importDefault(require("./routes/auth"));
const movies_1 = __importDefault(require("./routes/movies"));
// Load environment variables from .env file
dotenv_1.default.config();
// Initialize Express application
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Rate limiting for authentication routes
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
// Middleware
// Enable CORS for cross-origin requests
app.use((0, cors_1.default)());
// Parse JSON request bodies
app.use(express_1.default.json());
// Apply rate limiting to auth routes
app.use('/api/auth', authLimiter, auth_1.default);
app.use('/api/movies', movies_1.default);
// Connect to MongoDB database
mongoose_1.default
    .connect(process.env.MONGO_URI || '', {})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
/**
 * Mongoose schema for Movie
 * @field userId - ID of the user who added the movie (required)
 * @field tmdbId - TMDB movie ID (required)
 * @field title - Movie title (required)
 * @field releaseYear - Release year
 * @field poster - URL to movie poster
 * @field imdbRating - TMDB vote average
 * @field status - Watch status (WANT_TO_WATCH or WATCHED)
 * @field rating - User's personal rating (1-10)
 * @field comments - User's comments
 * @field isFavorite - Whether the movie is a favorite
 */
const MovieSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    tmdbId: { type: String, required: true },
    title: { type: String, required: true },
    releaseYear: { type: String },
    poster: { type: String },
    imdbRating: { type: String },
    status: { type: String, enum: ['WANT_TO_WATCH', 'WATCHED'], default: 'WANT_TO_WATCH' },
    rating: { type: Number, min: 1, max: 10 },
    comments: { type: String },
    isFavorite: { type: Boolean, default: false },
});
exports.default = mongoose_1.default.model('Movie', MovieSchema);

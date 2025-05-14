import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface for Movie document
 */
export interface IMovie extends Document {
  userId: string;
  tmdbId: string;
  title: string;
  releaseYear: string;
  poster: string;
  imdbRating: string;
  status: 'WANT_TO_WATCH' | 'WATCHED';
  rating: number;
  comments: string;
  isFavorite: boolean;
}

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
const MovieSchema: Schema = new Schema({
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

export default mongoose.model<IMovie>('Movie', MovieSchema);
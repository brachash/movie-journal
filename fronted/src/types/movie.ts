export interface Movie {
  _id?: string; // Added for MongoDB ID
  tmdbId: string;
  title: string;
  releaseYear?: string;
  poster?: string;
  imdbRating?: string;
  status?: 'WANT_TO_WATCH' | 'WATCHED';
  rating?: number;
  comments?: string;
  isFavorite?: boolean;
}
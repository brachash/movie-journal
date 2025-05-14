import express, { Request, Response } from 'express';
import axios from 'axios';
import { body, param, query, validationResult } from 'express-validator';
import Movie, { IMovie } from '../models/Movie';
import authenticate from '../middleware/auth';

interface AuthRequest extends Request {
  userId?: string;
}

const router = express.Router();

/**
 * GET /api/movies/search
 * Search movies via TMDB API
 * @query query - Search term for movie title
 * @returns Array of movies with tmdbId, title, releaseYear, poster, imdbRating
 */
router.get(
  '/search',
  [query('query').notEmpty().withMessage('Search query is required')],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { query } = req.query;
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
          query,
        },
      });
      const movies = response.data.results.map((movie: any) => ({
        tmdbId: movie.id,
        title: movie.title,
        releaseYear: movie.release_date?.split('-')[0],
        poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
        imdbRating: movie.vote_average,
      }));
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching movies', error: (error as Error).message });
    }
  }
);

/**
 * POST /api/movies
 * Add a movie to user's personal space
 * @body tmdbId, title, releaseYear, poster, imdbRating, status
 * @returns Created movie object
 */
router.post(
  '/',
  authenticate,
  [
    body('tmdbId').notEmpty().withMessage('TMDB ID is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('status').isIn(['WANT_TO_WATCH', 'WATCHED']).withMessage('Invalid status'),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { tmdbId, title, releaseYear, poster, imdbRating, status } = req.body;
    try {
      const movie = new Movie({
        userId: req.userId,
        tmdbId,
        title,
        releaseYear,
        poster,
        imdbRating,
        status,
      });
      await movie.save();
      res.status(201).json(movie);
    } catch (error) {
      res.status(500).json({ message: 'Error adding movie', error: (error as Error).message });
    }
  }
);

/**
 * GET /api/movies
 * Get all movies for the authenticated user
 * @returns Array of user's movies
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const movies = await Movie.find({ userId: req.userId });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies', error: (error as Error).message });
  }
});

/**
 * GET /api/movies/favorites
 * Get all favorite movies for the authenticated user
 * @returns Array of user's favorite movies
 */
router.get('/favorites', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const movies = await Movie.find({ userId: req.userId, isFavorite: true });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorite movies', error: (error as Error).message });
  }
});

/**
 * PUT /api/movies/:id
 * Update a movie's details
 * @param id - Movie ID
 * @body status, rating, comments, isFavorite
 * @returns Updated movie object
 */
router.put(
  '/:id',
  authenticate,
  [
    param('id').isMongoId().withMessage('Invalid movie ID'),
    body('status').optional().isIn(['WANT_TO_WATCH', 'WATCHED']).withMessage('Invalid status'),
    body('rating').optional().isInt({ min: 1, max: 10 }).withMessage('Rating must be between 1 and 10'),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { status, rating, comments, isFavorite } = req.body;
    try {
      const movie = await Movie.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { status, rating, comments, isFavorite },
        { new: true }
      );
      if (!movie) return res.status(404).json({ message: 'Movie not found' });
      res.json(movie);
    } catch (error) {
      res.status(500).json({ message: 'Error updating movie', error: (error as Error).message });
    }
  }
);

/**
 * DELETE /api/movies/:id
 * Delete a movie from user's space
 * @param id - Movie ID
 * @returns Success message
 */
router.delete(
  '/:id',
  authenticate,
  [param('id').isMongoId().withMessage('Invalid movie ID')],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const movie = await Movie.findOneAndDelete({ _id: req.params.id, userId: req.userId });
      if (!movie) return res.status(404).json({ message: 'Movie not found' });
      res.json({ message: 'Movie deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting movie', error: (error as Error).message });
    }
  }
);
// here new endpoint - bracha
router.get(
  '/:tmdbId',
  [param('tmdbId').notEmpty().withMessage('TMDB ID is required')],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { tmdbId } = req.params;
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
        },
      });
      const movie = {
        tmdbId: response.data.id.toString(),
        title: response.data.title,
        releaseYear: response.data.release_date ? response.data.release_date.split('-')[0] : '',
        poster: response.data.poster_path ? `https://image.tmdb.org/t/p/w500${response.data.poster_path}` : '',
        imdbRating: response.data.vote_average ? response.data.vote_average.toString() : '',
      };
      res.json(movie);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching movie details', error: (error as Error).message });
    }
  })

export default router;
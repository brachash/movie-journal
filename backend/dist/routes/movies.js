"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const express_validator_1 = require("express-validator");
const Movie_1 = __importDefault(require("../models/Movie"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
/**
 * GET /api/movies/search
 * Search movies via TMDB API
 * @query query - Search term for movie title
 * @returns Array of movies with tmdbId, title, releaseYear, poster, imdbRating
 */
router.get('/search', [(0, express_validator_1.query)('query').notEmpty().withMessage('Search query is required')], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { query } = req.query;
    try {
        const response = await axios_1.default.get(`https://api.themoviedb.org/3/search/movie`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                query,
            },
        });
        const movies = response.data.results.map((movie) => ({
            tmdbId: movie.id,
            title: movie.title,
            releaseYear: movie.release_date?.split('-')[0],
            poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
            imdbRating: movie.vote_average,
        }));
        res.json(movies);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching movies', error: error.message });
    }
});
/**
 * POST /api/movies
 * Add a movie to user's personal space
 * @body tmdbId, title, releaseYear, poster, imdbRating, status
 * @returns Created movie object
 */
router.post('/', auth_1.default, [
    (0, express_validator_1.body)('tmdbId').notEmpty().withMessage('TMDB ID is required'),
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('status').isIn(['WANT_TO_WATCH', 'WATCHED']).withMessage('Invalid status'),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { tmdbId, title, releaseYear, poster, imdbRating, status } = req.body;
    try {
        const movie = new Movie_1.default({
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding movie', error: error.message });
    }
});
/**
 * GET /api/movies
 * Get all movies for the authenticated user
 * @returns Array of user's movies
 */
router.get('/', auth_1.default, async (req, res) => {
    try {
        const movies = await Movie_1.default.find({ userId: req.userId });
        res.json(movies);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching movies', error: error.message });
    }
});
/**
 * GET /api/movies/favorites
 * Get all favorite movies for the authenticated user
 * @returns Array of user's favorite movies
 */
router.get('/favorites', auth_1.default, async (req, res) => {
    try {
        const movies = await Movie_1.default.find({ userId: req.userId, isFavorite: true });
        res.json(movies);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching favorite movies', error: error.message });
    }
});
/**
 * PUT /api/movies/:id
 * Update a movie's details
 * @param id - Movie ID
 * @body status, rating, comments, isFavorite
 * @returns Updated movie object
 */
router.put('/:id', auth_1.default, [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid movie ID'),
    (0, express_validator_1.body)('status').optional().isIn(['WANT_TO_WATCH', 'WATCHED']).withMessage('Invalid status'),
    (0, express_validator_1.body)('rating').optional().isInt({ min: 1, max: 10 }).withMessage('Rating must be between 1 and 10'),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { status, rating, comments, isFavorite } = req.body;
    try {
        const movie = await Movie_1.default.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { status, rating, comments, isFavorite }, { new: true });
        if (!movie)
            return res.status(404).json({ message: 'Movie not found' });
        res.json(movie);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating movie', error: error.message });
    }
});
/**
 * DELETE /api/movies/:id
 * Delete a movie from user's space
 * @param id - Movie ID
 * @returns Success message
 */
router.delete('/:id', auth_1.default, [(0, express_validator_1.param)('id').isMongoId().withMessage('Invalid movie ID')], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const movie = await Movie_1.default.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!movie)
            return res.status(404).json({ message: 'Movie not found' });
        res.json({ message: 'Movie deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting movie', error: error.message });
    }
});
exports.default = router;

import { Request, Response } from "express";
import axios from "axios";
import Movie, { IMovie } from "../models/movie.model";
import { sendError } from "../utils";

interface AuthRequest extends Request {
  userId?: string;
}

/**
 * Search movies via TMDB API
 */
export const searchMovies = async (req: Request, res: Response) => {
  const { query } = req.query as { query: string };
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          query,
        },
      }
    );
    const movies = response.data.results.map((movie: any) => ({
      tmdbId: movie.id,
      title: movie.title,
      releaseYear: movie.release_date?.split("-")[0],
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "",
      imdbRating: movie.vote_average,
    }));
    return res.json(movies);
  } catch (err) {
    return sendError(
      res,
      500,
      `Error fetching movies: ${(err as Error).message}`
    );
  }
};

/**
 * Add a movie to the authenticated user's list
 */
export const addMovie = async (req: AuthRequest, res: Response) => {
  const { userId } = req;
  const { tmdbId, title, status, releaseYear, poster, imdbRating } = req.body;

  if (!userId) {
    return sendError(res, 401, "Authentication required");
  }
  if (!tmdbId || !title || !status) {
    return sendError(res, 400, "tmdbId, title and status are required");
  }

  try {
    // Prevent adding the same movie twice
    const exists = await Movie.findOne({ userId, tmdbId });
    if (exists) {
      return sendError(res, 409, "Movie already exists in your list");
    }

    const movie = await Movie.create({
      userId,
      tmdbId,
      title,
      releaseYear: releaseYear ?? "",
      poster: poster ?? "",
      imdbRating: imdbRating ?? "",
      status,
    });

    return res.status(201).json(movie);
  } catch (err) {
    return sendError(res, 500, "Could not add movie");
  }
};

/**
 * Get all movies for the authenticated user
 */
export const getMovies = async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    return sendError(res, 401, "Authentication required");
  }
  try {
    const movies = await Movie.find({ userId: req.userId });
    return res.json(movies);
  } catch (err) {
    return sendError(
      res,
      500,
      `Error fetching movies: ${(err as Error).message}`
    );
  }
};

/**
 * Get all favorite movies for the authenticated user
 */
export const getFavorites = async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    return sendError(res, 401, "Authentication required");
  }
  try {
    const movies = await Movie.find({ userId: req.userId, isFavorite: true });
    return res.json(movies);
  } catch (err) {
    return sendError(
      res,
      500,
      `Error fetching favorite movies: ${(err as Error).message}`
    );
  }
};

/**
 * Update a movie's details
 */
export const updateMovie = async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    return sendError(res, 401, "Authentication required");
  }
  const { status, rating, comments, isFavorite } = req.body;
  try {
    const movie = await Movie.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status, rating, comments, isFavorite },
      { new: true }
    );
    if (!movie) {
      return sendError(res, 404, "Movie not found");
    }
    return res.json(movie);
  } catch (err) {
    return sendError(
      res,
      500,
      `Error updating movie: ${(err as Error).message}`
    );
  }
};

/**
 * Delete a movie from user's space
 */
export const deleteMovie = async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    return sendError(res, 401, "Authentication required");
  }
  try {
    const movie = await Movie.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!movie) {
      return sendError(res, 404, "Movie not found");
    }
    return res.json({ message: "Movie deleted" });
  } catch (err) {
    return sendError(
      res,
      500,
      `Error deleting movie: ${(err as Error).message}`
    );
  }
};

/**
 * Get detailed info for a single TMDB movie
 */
export const getMovieDetails = async (req: Request, res: Response) => {
  const { tmdbId } = req.params;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${tmdbId}`,
      {
        params: { api_key: process.env.TMDB_API_KEY },
      }
    );
    const data = response.data;
    return res.json({
      tmdbId: data.id.toString(),
      title: data.title,
      releaseYear: data.release_date?.split("-")[0] || "",
      poster: data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : "",
      imdbRating: data.vote_average?.toString() || "",
    });
  } catch (err) {
    return sendError(
      res,
      500,
      `Error fetching movie details: ${(err as Error).message}`
    );
  }
};

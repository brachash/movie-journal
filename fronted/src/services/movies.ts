import axios from 'axios';
import {type Movie } from '../types/movie';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  } else {
    delete config.headers['Authorization'];
  }
  return config;
});

export const searchMovies = async (query: string): Promise<Movie[]> => {
  const response = await axios.get(`${API_URL}/movies/search`, {
    params: { query },
  });
  return response.data;
};

export const getMovieById = async (tmdbId: string): Promise<Movie> => {
  const response = await axios.get(`${API_URL}/movies/${tmdbId}`);
  return response.data;
};

export const addMovie = async (movie: Partial<Movie>): Promise<Movie> => {
  const response = await api.post('/movies', movie);
  return response.data;
};

export const getUserMovies = async (): Promise<Movie[]> => {
  const response = await api.get('/movies');
  return response.data;
};

export const getFavoriteMovies = async (): Promise<Movie[]> => {
  const response = await api.get('/movies/favorites');
  return response.data;
};

export const updateMovie = async (id: string, updates: Partial<Movie>): Promise<Movie> => {
  const response = await api.put(`/movies/${id}`, updates);
  return response.data;
};

export const deleteMovie = async (id: string): Promise<void> => {
  await api.delete(`/movies/${id}`);
};
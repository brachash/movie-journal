import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface AuthResponse {
  token: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

export const signup = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/signup`, { email, password });
  return response.data; 
};
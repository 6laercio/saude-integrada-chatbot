import axios from 'axios';
import { env } from '../config/env.js';

export const api = axios.create({
  baseURL: env.MOCK_API_URL,
  timeout: 5000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

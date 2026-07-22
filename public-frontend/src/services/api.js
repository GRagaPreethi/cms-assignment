import axios from 'axios';

// Server-side: use internal API_URL (docker service name)
// Client-side: use NEXT_PUBLIC_API_URL
const BASE_URL =
  typeof window === 'undefined'
    ? (process.env.API_URL || 'http://localhost:5000')
    : (process.env.NEXT_PUBLIC_API_URL || '');

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;

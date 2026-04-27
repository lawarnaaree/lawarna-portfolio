import axios from 'axios';

const defaultApiUrl = window.location.hostname.includes('lawarnaaree.com.np')
  ? 'https://api.lawarnaaree.com.np/api'
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

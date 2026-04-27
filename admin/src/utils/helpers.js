export const getFileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // Fallback for production if env var is missing
  const defaultApiUrl = window.location.hostname.includes('lawarnaaree.com.np')
    ? 'https://api.lawarnaaree.com.np/api'
    : 'http://localhost:5000/api';

  const apiUrl = import.meta.env.VITE_API_URL || defaultApiUrl;
  const baseUrl = apiUrl.replace('/api', '');
  
  // Ensure we don't have double slashes or missing slashes
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${cleanBaseUrl}${cleanPath}`;
};

export const getFileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;

  // Fallback for production if env var is missing
  const defaultApiUrl = window.location.hostname.includes('lawarnaaree.com.np')
    ? 'https://api.lawarnaaree.com.np/api'
    : 'http://localhost:5174/api';

  let apiUrl = import.meta.env.VITE_API_URL || defaultApiUrl;
  
  // SECURE FIX: Remove accidental leading dots or redundant segments
  apiUrl = apiUrl.replace('https://.', 'https://');
  
  const baseUrl = apiUrl.replace(/\/api$/, '');
  
  // Ensure we don't have double slashes or missing slashes
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // SECURE FIX: Ensure path doesn't already contain /api if we are appending it to baseUrl
  let cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath.startsWith('/api/')) {
    cleanPath = cleanPath.replace('/api/', '/');
  }
  
  return `${cleanBaseUrl}${cleanPath}`;
};

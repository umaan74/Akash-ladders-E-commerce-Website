// Centralized API configuration for Akash Ladders
// Environment variable VITE_API_BASE_URL is set in Vercel production
// For local development, VITE_API_BASE_URL defaults to empty string '', leveraging Vite's proxy (/api -> http://127.0.0.1:5000)

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
export const API_BASE_URL = rawBaseUrl.trim().replace(/\/+$/, '');

// Socket.IO Server connection URL
// In production (Vercel -> Render), connects directly to the backend URL (VITE_API_BASE_URL).
// In local development, connects to origin (leveraging Vite ws proxy) or directly to backend port.
export const SOCKET_SERVER_URL = API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');

/**
 * Helper to construct full API endpoint URL
 * @param {string} endpoint - Relative API endpoint starting with /api (e.g. '/api/products')
 * @returns {string} Full URL formatted for current environment
 */
export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};

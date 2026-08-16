// Centralized API configuration for Akash Ladders
// Environment variable VITE_API_BASE_URL is set in Vercel production
// For local development, VITE_API_BASE_URL defaults to empty string '', leveraging Vite's proxy (/api -> http://127.0.0.1:5000)

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
export const API_BASE_URL = rawBaseUrl.trim().replace(/\/+$/, '');

/**
 * Helper to construct full API endpoint URL
 * @param {string} endpoint - Relative API endpoint starting with /api (e.g. '/api/products')
 * @returns {string} Full URL formatted for current environment
 */
export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};

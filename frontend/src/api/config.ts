/**
 * API configuration for the SkillCrawler frontend
 */

// API base URL - use environment variable or default to localhost
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Default request timeout in milliseconds
export const DEFAULT_TIMEOUT = 10000;

// Auth token storage key in localStorage
export const TOKEN_STORAGE_KEY = 'skillcrawler_token';

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

// Set auth token in localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

// Default headers for API requests
export const getDefaultHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

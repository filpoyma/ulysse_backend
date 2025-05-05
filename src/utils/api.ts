import { getAccessToken, refreshAccessToken, isTokenExpired } from './auth';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export const api = async (endpoint: string, options: RequestOptions = {}) => {
  const { skipAuth = false, ...fetchOptions } = options;
  
  const baseUrl = '/api/v1';
  const url = `${baseUrl}${endpoint}`;
  
  // Always include credentials for cookies
  fetchOptions.credentials = 'include';
  
  if (!skipAuth) {
    let token = getAccessToken();
    
    if (token && isTokenExpired(token)) {
      token = await refreshAccessToken();
      if (!token) {
        throw new Error('Authentication required');
      }
    }
    
    if (token) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    }
  }

  const response = await fetch(url, fetchOptions);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  
  return response.json();
};
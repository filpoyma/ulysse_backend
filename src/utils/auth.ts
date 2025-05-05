import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  exp: number;
}

let accessToken: string | null = null;

export const getAccessToken = () => accessToken;

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const removeAccessToken = () => {
  accessToken = null;
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await fetch('/api/v1/users/refresh-token', {
      method: 'POST',
      credentials: 'include', // Important for sending cookies
    });

    if (!response.ok) {
      removeAccessToken();
      return null;
    }

    const data = await response.json();
    setAccessToken(data.accessToken);
    return data.accessToken;
  } catch (error) {
    removeAccessToken();
    return null;
  }
};
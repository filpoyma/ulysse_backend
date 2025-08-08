import api, { requestWithRefresh } from '../api/baseApi';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
  }

interface LoginResponse {
    accessToken: string;
    user: User;
  }

  interface LoginCredentials {
    email: string;
    password: string;
  }

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

interface RefreshResponse {
  accessToken: string;
}

interface ValidateSessionResponse {
  user: User;
}

const AuthApi = {
  basePath: 'auth',

  getUrl(path: string) {
    return `${this.basePath}/${path}/`;
  },

  login(credentials: LoginCredentials): Promise<LoginResponse> {
    const url = this.getUrl('login');

    return api.post(url, { 
        json: credentials,
        credentials: 'include',
        timeout: 10000,
      }).json();
  },

  register(credentials: RegisterCredentials): Promise<void> {
    const url = this.getUrl('register');
    return api.post(url, {
      json: credentials,
      timeout: 10000,
    }).json();
  },

  refreshToken(): Promise<RefreshResponse> {
    const url = this.getUrl('refresh-token');
    return api.post(url, {
      credentials: 'include',
      timeout: 5000,
    }).json();
  },

  logout(): Promise<void> {
    const url = this.getUrl('logout');
    return api.post(url, {
      credentials: 'include',
      timeout: 5000,
      retry: 0,
    }).json();
  },

  validateSession(): Promise<ValidateSessionResponse> {
    const url = this.getUrl('profile');
    return requestWithRefresh(url, {
      credentials: 'include',
    });
  }
};

export default AuthApi;

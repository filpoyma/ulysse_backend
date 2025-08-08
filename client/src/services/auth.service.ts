import { authActions } from '../store/reducers/auth';
import { store } from '../store';
import AuthApi from '../api/auth.api';

export const authService = {
  async login(credentials: Parameters<typeof AuthApi.login>[0]) {
    try {
      const response = await AuthApi.login(credentials);
      console.log('file-auth.service.ts LOGIN response:', response);
      store.dispatch(authActions.setToken(response.accessToken));
      store.dispatch(authActions.setUser(response.user));
      store.dispatch(authActions.setIsLoggedIn(true));
      return response;
    } catch (error) {
      console.error('Login error:', error);
      store.dispatch(authActions.clearAuthState());
      throw error;
    }
  },

  async register(credentials: Parameters<typeof AuthApi.register>[0]) {
    try {
      const response = await AuthApi.register(credentials);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async refreshToken() {
    try {
      const response = await AuthApi.refreshToken();
      console.log('file-auth.service.ts refreshToken:', response.accessToken);
      store.dispatch(authActions.setToken(response.accessToken));
      return response.accessToken;
    } catch (error) {
      console.error('Refresh token error:', error);
      await this.logout();
      throw error;
    }
  },

  async logout() {
    try {
      await AuthApi.logout();
      store.dispatch(authActions.clearAuthState());
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  async validateSession() {
    try {
      const response = await AuthApi.validateSession();
      store.dispatch(authActions.setUser(response.user));
      store.dispatch(authActions.setIsLoggedIn(true));
      return response.user;
    } catch (error) {
      store.dispatch(authActions.clearAuthState());
      throw error;
    }
  },
};

import ky, { HTTPError, KyResponse } from 'ky';
import { store } from '../store';
import { API_URL } from '../constants/api.constants';
import { authActions } from '../store/reducers/auth';

const baseApi = ky.create({
  prefixUrl: API_URL,
  timeout: 15000,
  credentials: 'same-origin',
});

const tokenInterceptor = (request: Request) => {
  const { token } = store.getState().auth;
  if (token) request.headers.set('Authorization', `Bearer ${token}`);
};

const errorInterceptor = async (error: HTTPError) => {
  const response: KyResponse<{ message: string; success: boolean; status: number }> =
    error.response;
  // Handle 401 Unauthorized
  if (response.status === 401) {
    try {
      const { data } = await baseApi
        .post('auth/refresh-token')
        .json<{ data: { accessToken: string } }>();
      store.dispatch(authActions.setToken(data.accessToken));
      return error;
    } catch {
      store.dispatch(authActions.clearAuthState());
      return error;
    }
  }
  console.error('Error:', response.status, response.url);
  const contentType = response.headers.get('content-type');
  if (!contentType) return error;
  error.message = contentType?.includes('application/json')
    ? (await response.json())?.message
    : await response.text();
  console.log('>>>baseApi error.message:<<<', error.message);
  return error;
};

const api = baseApi.extend({
  hooks: {
    beforeRequest: [tokenInterceptor],
    beforeError: [errorInterceptor],
  },
});

// Функция-обёртка для критичных запросов (например, validateSession), чтобы явно контролировать refresh и повтор
export async function requestWithRefresh<T>(input: RequestInfo, options?: RequestInit): Promise<T> {
  try {
    return await api(input, options).json();
  } catch (error: unknown) {
    if (error instanceof HTTPError && error.response.status === 401) {
      try {
        const { data } = await baseApi
          .post('auth/refresh-token')
          .json<{ data: { accessToken: string } }>();
        store.dispatch(authActions.setToken(data.accessToken));
        const headers = new Headers(options?.headers || {});
        headers.set('Authorization', `Bearer ${data.accessToken}`);
        return await api(input, { ...options, headers }).json();
      } catch (refreshError) {
        store.dispatch(authActions.clearAuthState());
        throw refreshError;
      }
    }
    throw error;
  }
}

// === АВТОМАТИЧЕСКОЕ ОБНОВЛЕНИЕ ТОКЕНА КАЖДЫЕ 10 МИНУТ ===
async function autoRefreshToken() {
  try {
    const { data } = await baseApi
      .post('auth/refresh-token')
      .json<{ data: { accessToken: string } }>();
    store.dispatch(authActions.setToken(data.accessToken));
  } catch {
    store.dispatch(authActions.clearAuthState());
  }
}

let refreshIntervalId: ReturnType<typeof setInterval> | null = null;

// Подписка на изменения isLoggedIn
store.subscribe(() => {
  const { isLoggedIn } = store.getState().auth;
  if (isLoggedIn) startRefreshInterval();
  else stopRefreshInterval();
});

function startRefreshInterval() {
  if (refreshIntervalId) return; // Уже запущен
  refreshIntervalId = setInterval(autoRefreshToken, 10 * 60 * 1000);
}

function stopRefreshInterval() {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
  }
}

export default api;

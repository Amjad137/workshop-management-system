import { ROUTES } from '@/constants/routes.constants';
import { authClient } from '@/config/better-auth/auth.client';
import { useAuthStore } from '@/stores/auth.store';
import axios from 'axios';
import { environment } from './env.config';

const Axios = axios.create({
  baseURL: environment.apiURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

Axios.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(new Error(error)),
);

Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      try {
        const { data: session } = await authClient.getSession();
        if (!session) {
          const { signOutApp } = useAuthStore.getState();
          await signOutApp();

          if (typeof window !== 'undefined') {
            window.location.href = ROUTES.SIGN_IN;
          }
        }
      } catch {
        // Ignore session validation errors and surface original error
      }
    }

    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  },
);

export default Axios;

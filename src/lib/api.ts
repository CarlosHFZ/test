import { getAuthData } from '@/lib/authStorage';
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
  withCredentials: true,
});


api.interceptors.request.use(
  (config) => {
    const authData = getAuthData();
    if (authData?.token) {
      config.headers.Authorization = `Bearer ${authData.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event('auth-error'));
    }
    return Promise.reject(error);
  }
);

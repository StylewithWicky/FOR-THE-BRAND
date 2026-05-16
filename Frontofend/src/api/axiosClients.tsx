import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useNotificationStore } from '../hooks/useNotification';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor typed automatically
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global Response interceptor tracking FastAPI back-end shapes
axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string }>) => {
    const { showToast } = useNotificationStore.getState();

    if (error.response) {
      const status = error.response.status;
      const backendMessage = error.response.data?.detail;

      switch (status) {
        case 429:
          showToast("Calm down, chief. You're clicking too fast! Rate limit exceeded.", "warning");
          break;
        case 401:
          showToast("Session expired. Please log back in.", "error");
          break;
        case 500:
          showToast("Server side stumbled. We're on it.", "error");
          break;
        default:
          showToast(typeof backendMessage === 'string' ? backendMessage : "Something went sideways.", "error");
      }
    } else {
      showToast("Network isolated. Check your connection.", "error");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
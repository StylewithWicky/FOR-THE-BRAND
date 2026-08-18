import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useNotificationStore } from '../hooks/useNotification';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string);

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'multipart/form-data'},
});

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('yolo_token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string }>) => {
    const { showToast } = useNotificationStore.getState();

    if (error.response?.status === 401) {
      showToast("Session expired. Please log back in.", "error");
      localStorage.removeItem('yolo_token');
      localStorage.removeItem('yolo_email');
      window.location.href = '/kufika'; 
    } else if (error.response?.status === 429) {
      showToast("Rate limit exceeded.", "warning");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
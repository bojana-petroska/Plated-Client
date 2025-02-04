import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const userToken = localStorage.getItem('userAuthToken');
  const restaurantToken = localStorage.getItem('restaurantAuthToken');

  if (config.url?.includes('/restaurants')) {
    config.headers.Authorization = `Bearer ${restaurantToken}`;
  }

  if (config.url?.includes('/users')) {
    config.headers.Authorization = `Bearer ${userToken}`;
  }
  return config;
});

export default axiosInstance;

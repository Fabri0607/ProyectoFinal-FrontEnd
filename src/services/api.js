import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:5151/api',
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    const message = error.response?.data || error.message || 'Error en la solicitud';
    toast.error(`Error: ${message}`);
    // Handle token expiration or unauthorized access
    if (error.response?.status === 401) {
      // Optionally, clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login'; // Adjust based on your routing
    }
    return Promise.reject(error);
  }
);

export default api;
import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:5151/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Error en la solicitud';
    if (error.response?.status === 401) {
      toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      localStorage.clear();
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      toast.error('No tienes permiso para realizar esta acción.');
    } else {
      toast.error(`Error: ${message}`);
    }
    return Promise.reject(error);
  }
);

export default api;
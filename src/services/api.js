import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:5151/api',
});

api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data || error.message || 'Error en la solicitud';
    toast.error(`Error: ${message}`);
    return Promise.reject(error);
  }
);

export default api;
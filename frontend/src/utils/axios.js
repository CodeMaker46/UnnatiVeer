import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
instance.interceptors.request.use(
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

// Add a response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_INSUFFICIENT_RESOURCES') {
      console.error('Server resource limit reached');
    }
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      // Optionally redirect to login
      window.location.href = '/login/organization';
    }
    return Promise.reject(error);
  }
);

export default instance; 
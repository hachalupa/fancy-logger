import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',  // ← Проверь URL твоего бэкенда!
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request interceptor (добавляет токен к каждому запросу)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor (обрабатывает 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('🚫 Unauthorized (401) - Token expired or invalid');
      
      // Очищаем токен
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      
      // Редирект на логин (если не на странице логина)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

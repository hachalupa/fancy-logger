// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  console.log('Token', token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Headers:', config.headers);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('401 - Unauthorized');
      
      
    }
    return Promise.reject(error);
  }
);

export default api;


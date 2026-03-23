import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8080/api' });

// Add token to requests if present
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const sendOtp = (identifier, method) => API.post('/auth/send-otp', { identifier, method });
export const verifyOtp = (identifier, otp) => API.post('/auth/verify-otp', { identifier, otp });
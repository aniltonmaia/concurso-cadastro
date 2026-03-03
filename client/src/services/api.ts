import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string, role: string) => {
    const response = await api.post('/auth/register', { name, email, password, role });
    return response.data;
  },
  updateProfile: async (name: string, email: string) => {
    const response = await api.put('/auth/profile', { name, email });
    return response.data;
  },
  updatePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/auth/password', { currentPassword, newPassword });
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get('/auth/users');
    return response.data;
  },
  createUser: async (name: string, email: string, password: string, role: string) => {
    const response = await api.post('/auth/users', { name, email, password, role });
    return response.data;
  },
  deleteUser: async (userId: number) => {
    const response = await api.delete(`/auth/users/${userId}`);
    return response.data;
  },
  updateUser: async (userId: number, name: string, email: string, role: string) => {
    const response = await api.put(`/auth/users/${userId}`, { name, email, role });
    return response.data;
  },
};

export const candidatesAPI = {
  getAll: async (filters?: { status?: string; position?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.position) params.append('position', filters.position);
    
    const response = await api.get(`/candidates?${params}`);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },
  create: async (candidate: any) => {
    const response = await api.post('/candidates', candidate);
    return response.data;
  },
  update: async (id: number, candidate: any) => {
    const response = await api.put(`/candidates/${id}`, candidate);
    return response.data;
  },
  updateStatus: async (id: number, status: string) => {
    const response = await api.patch(`/candidates/${id}/status`, { status });
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/candidates/${id}`);
    return response.data;
  },
};

export default api;

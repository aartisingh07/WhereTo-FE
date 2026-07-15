import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/user');
    return response.data;
  },

  getUserProfile: async (userId) => {
    const response = await api.get(`/user/profile/${userId}`);
    return response.data;
  },

  updateProfile: async (formData) => {
    const response = await api.put('/auth/update-profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};


import api from './api';

const TOKEN_KEY = 'cms_token';

const authService = {
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    return data.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },

  verify: async () => {
    const { data } = await api.get('/auth/verify');
    return data.data;
  },

  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
};

export default authService;

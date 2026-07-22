import api from './api';

const pagesService = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/pages', { params });
    return data.data;
  },

  getBySlug: async (slug) => {
    const { data } = await api.get(`/pages/${slug}`);
    return data.data;
  },

  getById: async (id) => {
    // Pages API uses slug for GET, but we can search by id in the list
    const { data } = await api.get('/pages', { params: { limit: 1000 } });
    const page = data.data.pages.find((p) => p._id === id);
    return { page };
  },

  create: async (pageData) => {
    const { data } = await api.post('/pages', pageData);
    return data.data;
  },

  update: async (id, pageData) => {
    const { data } = await api.put(`/pages/${id}`, pageData);
    return data.data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/pages/${id}`);
    return data;
  },

  publish: async (id) => {
    const { data } = await api.put(`/pages/${id}`, { status: 'published' });
    return data.data;
  },

  unpublish: async (id) => {
    const { data } = await api.put(`/pages/${id}`, { status: 'draft' });
    return data.data;
  },
};

export default pagesService;

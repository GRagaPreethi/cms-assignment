import api from './api';

const pagesService = {
  getAllPublished: async (params = {}) => {
    const { data } = await api.get('/pages', { params: { status: 'published', ...params } });
    return data.data;
  },

  getBySlug: async (slug) => {
    const { data } = await api.get(`/pages/${slug}`);
    return data.data;
  },
};

export default pagesService;

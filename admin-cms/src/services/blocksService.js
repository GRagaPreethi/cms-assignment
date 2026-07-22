import api from './api';

const blocksService = {
  create: async (blockData) => {
    const { data } = await api.post('/blocks', blockData);
    return data.data;
  },

  update: async (id, blockData) => {
    const { data } = await api.put(`/blocks/${id}`, blockData);
    return data.data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/blocks/${id}`);
    return data;
  },
};

export default blocksService;

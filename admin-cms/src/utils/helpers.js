export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
};

export const formatShortDate = (dateString) => {
  if (!dateString) return '—';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
};

export const truncate = (str, maxLength = 100) => {
  if (!str) return '';
  return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
};

export const editorJSToBlocks = (editorData) => {
  if (!editorData || !editorData.blocks) return [];
  return editorData.blocks.map((block, idx) => ({
    type: block.type === 'nestedList' ? 'nested-list' : block.type,
    data: block.data,
    order: idx,
  }));
};

export const blocksToEditorJS = (blocks) => {
  if (!blocks || !Array.isArray(blocks)) return { blocks: [], version: '2.28.2', time: Date.now() };
  const sorted = [...blocks].sort((a, b) => a.order - b.order);
  return {
    version: '2.28.2',
    time: Date.now(),
    blocks: sorted.map((block) => ({
      id: block._id || `block_${Math.random().toString(36).substr(2, 9)}`,
      type: block.type === 'nested-list' ? 'nestedList' : block.type,
      data: block.data,
    })),
  };
};

export const getBlockCount = (blocks = []) => blocks.length;

export const getStatusColor = (status) => {
  return status === 'published'
    ? 'bg-green-100 text-green-800'
    : 'bg-yellow-100 text-yellow-800';
};

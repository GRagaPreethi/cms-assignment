export const BLOCK_TYPES = {
  HEADER: 'header',
  PARAGRAPH: 'paragraph',
  LIST: 'list',
  NESTED_LIST: 'nested-list',
  TABLE: 'table',
  EQUATION: 'equation',
  IMAGE: 'image',
  DOCUMENTATION: 'documentation',
  MIXED_CONTENT: 'mixed-content',
};

export const PAGE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
};

export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  EDITOR: 'editor',
};

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PAGES: '/pages',
  CREATE_PAGE: '/pages/create',
  EDIT_PAGE: (id) => `/pages/edit/${id}`,
  SETTINGS: '/settings',
};

export const API_ENDPOINTS = {
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_VERIFY: '/auth/verify',
  PAGES: '/pages',
  PAGE_BY_SLUG: (slug) => `/pages/${slug}`,
  PAGE_BY_ID: (id) => `/pages/${id}`,
  BLOCKS: '/blocks',
  BLOCK_BY_ID: (id) => `/blocks/${id}`,
};

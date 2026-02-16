const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper function to get auth token
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

// Auth APIs
export const authAPI = {
  quickLogin: (password) =>
    apiRequest('/auth/quick-login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),

  verifyToken: () =>
    apiRequest('/auth/verify-token', {
      method: 'POST',
    }),
};

// Portfolio APIs
export const portfolioAPI = {
  get: () =>
    apiRequest('/portfolio', {
      method: 'GET',
    }),

  create: (data) =>
    apiRequest('/portfolio', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (data) =>
    apiRequest('/portfolio', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Skills APIs
export const skillsAPI = {
  getAll: () =>
    apiRequest('/skills', {
      method: 'GET',
    }),

  getByCategory: (category) =>
    apiRequest(`/skills/${category}`, {
      method: 'GET',
    }),

  create: (data) =>
    apiRequest('/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiRequest(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiRequest(`/skills/${id}`, {
      method: 'DELETE',
    }),
};

// Projects APIs
export const projectsAPI = {
  getAll: () =>
    apiRequest('/projects', {
      method: 'GET',
    }),

  getFeatured: () =>
    apiRequest('/projects/featured', {
      method: 'GET',
    }),

  getById: (id) =>
    apiRequest(`/projects/${id}`, {
      method: 'GET',
    }),

  create: (data) =>
    apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiRequest(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiRequest(`/projects/${id}`, {
      method: 'DELETE',
    }),
};

// Coding Profiles APIs
export const codingProfilesAPI = {
  getAll: () =>
    apiRequest('/coding-profiles', {
      method: 'GET',
    }),

  getByPlatform: (platform) =>
    apiRequest(`/coding-profiles/${platform}`, {
      method: 'GET',
    }),

  create: (data) =>
    apiRequest('/coding-profiles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (platform, data) =>
    apiRequest(`/coding-profiles/${platform}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (platform) =>
    apiRequest(`/coding-profiles/${platform}`, {
      method: 'DELETE',
    }),
};

// Contacts APIs
export const contactsAPI = {
  getAll: () =>
    apiRequest('/contacts', {
      method: 'GET',
    }),

  getById: (id) =>
    apiRequest(`/contacts/${id}`, {
      method: 'GET',
    }),

  create: (data) =>
    apiRequest('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateStatus: (id, status) =>
    apiRequest(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  delete: (id) =>
    apiRequest(`/contacts/${id}`, {
      method: 'DELETE',
    }),
};

// About APIs
export const aboutAPI = {
  get: () =>
    apiRequest('/about', {
      method: 'GET',
    }),

  create: (data) =>
    apiRequest('/about', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (data) =>
    apiRequest('/about', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

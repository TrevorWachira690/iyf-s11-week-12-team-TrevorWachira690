// Central place for all calls to the backend API.
// Every other file should import from here rather than calling fetch()
// directly, so the base URL and auth header logic only exist in one place.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
}

export const api = {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),

  // Posts
  getPosts: (page = 1, limit = 10) => request(`/posts?page=${page}&limit=${limit}`),
  searchPosts: (q) => request(`/posts/search?q=${encodeURIComponent(q)}`),
  getPost: (id) => request(`/posts/${id}`),
  createPost: (payload) => request('/posts', { method: 'POST', body: JSON.stringify(payload) }),
  updatePost: (id, payload) => request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deletePost: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
  toggleLike: (id) => request(`/posts/${id}/like`, { method: 'POST' }),
  toggleDislike: (id) => request(`/posts/${id}/dislike`, { method: 'POST' }),

  // Comments
  getComments: (postId) => request(`/comments/post/${postId}`),
  createComment: (payload) => request('/comments', { method: 'POST', body: JSON.stringify(payload) }),
  deleteComment: (id) => request(`/comments/${id}`, { method: 'DELETE' }),

  // Users
  getMe: () => request('/users/me'),
  getUser: (id) => request(`/users/${id}`),
  updateMe: (payload) => request('/users/me', { method: 'PUT', body: JSON.stringify(payload) }),
  exportData: () => request('/users/export'),
  importData: (payload) => request('/users/import', { method: 'POST', body: JSON.stringify(payload) }),

  // Health
  health: () => request('/health'),
};

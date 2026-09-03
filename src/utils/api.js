/**
 * Shared API utility — always attaches Bearer token from localStorage.
 * Usage: import { api } from '../../utils/api';
 *        const data = await api.get('/employees');
 *        await api.post('/leads', { ... });
 *        await api.put('/loans/123/status', { ... });
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL}`;

const getHeaders = (extra = {}) => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...extra,
  };
};

const handleResponse = async (res) => {
  if (res.status === 401) {
    // Token expired / not logged in
    localStorage.clear();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  if (res.status === 403) {
    throw new Error('Access denied. You do not have permission for this action.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
};

export const api = {
  get: (path, params) => {
    let url = `${BASE_URL}${path}`;
    if (params) {
      const qs = new URLSearchParams(params).toString();
      if (qs) url += `?${qs}`;
    }
    return fetch(url, { headers: getHeaders() }).then(handleResponse);
  },

  post: (path, body, options = {}) => {
    const isFormData = body instanceof FormData;
    const headers = isFormData
      ? { ...(localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {}) }
      : getHeaders();
    return fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: isFormData ? body : JSON.stringify(body),
      ...options,
    }).then(handleResponse);
  },

  put: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  patch: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (path) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),
};

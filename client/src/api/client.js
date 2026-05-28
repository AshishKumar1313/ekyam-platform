const API_BASE = import.meta.env.VITE_API_URL;

const getHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

async function request(path, options = {}) {
  const token = localStorage.getItem('ekyam_token');
  let res;

  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { ...getHeaders(token), ...options.headers },
    });
  } catch {
    throw new Error(
      'Cannot reach the server. Open http://localhost:3000 and run the backend: cd server → npm run dev (port 5000).'
    );
  }

  const text = await res.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        res.status === 502 || res.status === 503
          ? 'Backend is not running. Start it with: cd server && npm run dev'
          : `Server returned an invalid response (${res.status})`
      );
    }
  }

  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`);
    if (data.needsVerification) err.needsVerification = true;
    if (data.email) err.email = data.email;
    throw err;
  }

  return data;
}

export const api = {
  getPublicStats: () => request('/api/public/stats'),
  getCommunities: () => request('/api/public/communities'),
  getFeaturedProjects: () => request('/api/public/featured-projects'),

  register: (body) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  verifyOtp: (body) => request('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/api/auth/me'),
  updateProfile: (body) =>
    request('/api/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),

  getResources: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/resources${q ? `?${q}` : ''}`);
  },
  getResource: (id) => request(`/api/resources/${id}`),
  createResource: (body) =>
    request('/api/resources', { method: 'POST', body: JSON.stringify(body) }),
  updateResource: (id, body) =>
    request(`/api/resources/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteResource: (id) => request(`/api/resources/${id}`, { method: 'DELETE' }),
  requestResource: (id, body) =>
    request(`/api/resources/${id}/request`, { method: 'POST', body: JSON.stringify(body) }),

  getProjects: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/projects${q ? `?${q}` : ''}`);
  },
  getProject: (id) => request(`/api/projects/${id}`),
  createProject: (body) =>
    request('/api/projects', { method: 'POST', body: JSON.stringify(body) }),
  updateProject: (id, body) =>
    request(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProject: (id) => request(`/api/projects/${id}`, { method: 'DELETE' }),
  joinProject: (id, body) =>
    request(`/api/projects/${id}/join`, { method: 'POST', body: JSON.stringify(body) }),

  getCollaborations: () => request('/api/collaborations/mine'),
  updateCollaboration: (id, body) =>
    request(`/api/collaborations/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),

  getAdminStats: () => request('/api/admin/stats'),
  getAdminUsers: () => request('/api/admin/users'),
  deleteUser: (id) => request(`/api/admin/users/${id}`, { method: 'DELETE' }),
};

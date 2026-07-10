const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message || `Request failed: ${res.status}`);
  }
  return data;
}

export const api = {
  ingest: (type, content) =>
    request('/ingest', { method: 'POST', body: JSON.stringify({ type, content }) }),
  listItems: () => request('/items'),
  deleteItem: (id) => request(`/items/${id}`, { method: 'DELETE' }),
  query: (question) =>
    request('/query', { method: 'POST', body: JSON.stringify({ question }) }),
};
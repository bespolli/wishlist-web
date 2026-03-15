// Base URL of the backend API, taken from environment variable
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper: build Authorization header if token exists
function authHeaders(token: string | null) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// === AUTH REQUESTS ===

// Send login request, return token + user data
export async function loginRequest(email: string, password: string) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data; // { accessToken, user: { id, name, email, role } }
}

// Send register request, return token + user data
export async function registerRequest(name: string, email: string, password: string) {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data; // { accessToken, user: { id, name, email, role } }
}

// Send Google login request, return token + user data
export async function googleLoginRequest(credential: string) {
  const res = await fetch(`${API}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Google login failed');
  return data; // { accessToken, user: { id, name, email, role } }
}

// === WISH REQUESTS ===

// Fetch paginated list of wishes, optionally filtered by search query
export async function fetchWishes(token: string | null, page: number, search: string) {
  const params = new URLSearchParams({ page: String(page), limit: '10' });
  if (search) params.append('search', search);

  const res = await fetch(`${API}/wishes?${params}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to load wishes');
  return res.json(); // { data: Wish[], meta: { totalPages } }
}

// Create a new wish with given title and description
export async function createWish(token: string | null, title: string, description: string) {
  const res = await fetch(`${API}/wishes`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ title, description }),
  });
  if (!res.ok) throw new Error('Failed to create wish');
  return res.json();
}

// Update an existing wish by ID
export async function updateWish(token: string | null, id: string, title: string, description: string) {
  const res = await fetch(`${API}/wishes/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ title, description }),
  });
  if (!res.ok) throw new Error('Failed to update wish');
  return res.json();
}

// Delete a wish by ID
export async function deleteWish(token: string | null, id: string) {
  const res = await fetch(`${API}/wishes/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to delete wish');
}

// === ART SEARCH ===

// Search for artwork images by query string
export async function searchArt(query: string) {
  const res = await fetch(`${API}/artsearch?query=${encodeURIComponent(query)}`);
  const data = await res.json();
  // API returns either an array or an object with "artworks" field
  return Array.isArray(data) ? data : data.artworks || [];
}

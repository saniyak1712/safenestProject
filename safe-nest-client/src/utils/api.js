export const API_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");

export function getStoredAuth() {
  return {
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
    name: localStorage.getItem("name"),
    email: localStorage.getItem("email"),
    hostelId: localStorage.getItem("hostelId"),
  };
}

export function saveAuth(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
  localStorage.setItem("name", data.name || "");
  localStorage.setItem("email", data.email || "");

  if (data.hostelId) {
    localStorage.setItem("hostelId", data.hostelId);
  } else {
    localStorage.removeItem("hostelId");
  }
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
  localStorage.removeItem("hostelId");
}

export function authHeaders(extra = {}) {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

export function dashboardPathFor(role) {
  if (role === "admin" || role === "superAdmin") return "/admin";
  if (role === "student") return "/student";
  return "/";
}

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...options,
    headers: authHeaders(options.headers || {}),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (res.status === 401) {
    clearAuth();
  }

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

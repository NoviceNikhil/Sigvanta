import { API_BASE_URL } from "../config";

const BASE_URL = `${API_BASE_URL}/api/v1/admin/logs`;

const authFetch = (url, options = {}) =>
  fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function getAdminLogs(type, params = {}) {
  const url = `${BASE_URL}/${type}${buildQuery(params)}`;
  const res = await authFetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to fetch ${type} logs`);
  }
  const json = await res.json();
  return json.data ?? json;
}

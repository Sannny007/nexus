const BASE_URL = "http://localhost:5000/api";

export const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem("nexus_token");

  const headers = {
    "Content-Type" : "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {...options, headers});

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || "Request failed");
  }
  return res.json();
};
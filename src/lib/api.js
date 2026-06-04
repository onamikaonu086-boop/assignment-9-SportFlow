const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return await fetch(`${API_URL}${cleanPath}`, {
    ...options,
    headers,
    credentials: "include", 
  });
}

export { API_URL };
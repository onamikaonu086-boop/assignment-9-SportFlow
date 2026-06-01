const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ideavault_token");
}

export function setStoredToken(token) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("ideavault_token", token);
  } else {
    localStorage.removeItem("ideavault_token");
  }
}

export async function syncAuthAfterLogin(authClient) {
  try {
    const { data } = await authClient.getSession();
    if (data?.user) {
      return await syncJwtFromSession(data.user);
    }
    return null;
  } catch (error) {
    console.error("Error in syncAuthAfterLogin:", error);
    return null;
  }
}

export async function syncJwtFromSession(user) {
  if (!user?.email) return null;

  try {
    const res = await fetch(`${API_URL}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        name: user.name,
        image: user.image || "",
      }),
    });

    if (!res.ok) {
      console.error("Failed to sync token with backend. Status:", res.status);
      return null;
    }

    const data = await res.json();
    
    if (data?.token) {
      setStoredToken(data.token);
      return data.token;
    }
    
    return null;
  } catch (error) {
    console.error("Error in syncJwtFromSession:", error);
    return null;
  }
}
export async function apiFetch(path, options = {}) {
  const token = getStoredToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return await fetch(`${API_URL}${cleanPath}`, { 
    ...options, 
    headers 
  });
}

export { API_URL };
"use client";

import { createAuthClient } from "better-auth/react";
import { useCallback, useEffect, useState } from "react";

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/api/auth`
      : `${process.env.BETTER_AUTH_URL || "http://localhost:8000"}/api/auth`),
});

export function useSession() {
  const [session, setSession] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setIsPending(true);
    try {
      const { data } = await authClient.getSession();
      setSession(data || null);
      setError(null);
      return data;
    } catch (err) {
      setError(err);
      setSession(null);
      return null;
    } finally {
      setIsPending(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data: session, isPending, error, refetch };
}

export { useSession as authUseSession };
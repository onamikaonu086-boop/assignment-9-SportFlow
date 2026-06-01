"use client";

import { createAuthClient } from "better-auth/react";

const authBaseURL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  undefined;

export const authClient = createAuthClient({
  baseURL: authBaseURL,
});

export function useSession() {
  return authClient.useSession();
}

export { useSession as authUseSession };

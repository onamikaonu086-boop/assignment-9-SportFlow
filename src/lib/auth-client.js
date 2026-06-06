"use client";

import { createAuthClient } from "better-auth/react";

const authServerURL = (process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://assignment-9-sport-flow-server.vercel.app").replace(/\/$/, "");

export const authClient = createAuthClient({
  baseURL: authServerURL,
  basePath: "/api/auth",
  fetchOptions: {
    credentials: "include",
  },
});

export function useSession() {
  return authClient.useSession();
}
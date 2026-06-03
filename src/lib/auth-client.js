"use client";

import { createAuthClient } from "better-auth/react";

const normalizeBetterAuthUrl = (value) => {
  if (!value) return "https://assignment-9-sport-flow-server.vercel.app";
  return value.replace(/\/$/, "").replace(/\/api\/auth$/, "");
};

const authServerURL = normalizeBetterAuthUrl(process.env.NEXT_PUBLIC_BETTER_AUTH_URL);

export const authClient = createAuthClient({
  baseURL: authServerURL,
  basePath: "/api/auth",
});

export function useSession() {
  return authClient.useSession();
}
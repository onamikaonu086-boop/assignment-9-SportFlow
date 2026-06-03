"use client";

import { createAuthClient } from "better-auth/react";

const authServerURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL?.replace(/\/$/, "") || "https://assignment-9-sport-flow-server.vercel.app";

export const authClient = createAuthClient({
  baseURL: authServerURL,
  basePath: "/api/auth",
});

export function useSession() {
  return authClient.useSession();
}
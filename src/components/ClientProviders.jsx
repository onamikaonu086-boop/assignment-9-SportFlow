"use client";

import { SessionProvider } from "better-auth/react";
import ToastProvider from "./Shared/ToastProvider";

export default function ClientProviders({ children }) {
  return (
    <SessionProvider>
      <ToastProvider />
      {children}
    </SessionProvider>
  );
}

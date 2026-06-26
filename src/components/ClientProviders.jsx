"use client";

import { RouterProvider } from "@heroui/react";
import ToastProvider from "./Shared/ToastProvider";

export default function ClientProviders({ children }) {
  return (
    <RouterProvider>
      <ToastProvider />
      {children}
    </RouterProvider>
  );
}
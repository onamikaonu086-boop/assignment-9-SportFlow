"use client";

import { HeroUIProvider } from "@heroui/react";
import ToastProvider from "./Shared/ToastProvider";

export default function ClientProviders({ children }) {
  return (
    <HeroUIProvider> 
      <ToastProvider />
      {children}
    </HeroUIProvider>
  );
}
"use client";

import ToastProvider from "./Shared/ToastProvider";

export default function ClientProviders({ children }) {
  return (
    <>
      <ToastProvider />
      {children}
    </>
  );
}

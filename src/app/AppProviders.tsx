// src/app/AppProviders.tsx

"use client";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/context/ToastContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>{children}</ToastProvider>
    </SessionProvider>
  );
}

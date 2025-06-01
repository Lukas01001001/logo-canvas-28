// src/context/ToastContext.tsx
"use client";

import { createContext, useContext, useState } from "react";
import Toast from "@/components/ui/Toast";

type ToastType = "success" | "error" | "info";

type ToastState = {
  message: string;
  type: ToastType;
} | null;

type ToastContextType = {
  showToast: (msg: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

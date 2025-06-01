// src/components/ui/Toast.tsx

"use client";

import { useEffect, useState } from "react";

type ToastProps = {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
};

export default function Toast({ message, type = "info", onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    const remove = setTimeout(onClose, 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(remove);
    };
  }, [onClose]);

  const baseStyle =
    "fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-lg text-white flex items-center space-x-4 transition-all duration-500";

  const colorStyle =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-blue-600";
  /* const colorStyle =
    type === "success"
      ? "bg-green-500/80"
      : type === "error"
      ? "bg-red-500/80"
      : "bg-blue-500/80"; */

  const icon = type === "success" ? "✔" : type === "error" ? "⚠" : "ℹ";

  return (
    <div
      className={`${baseStyle} ${colorStyle} ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-base font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-auto text-white text-xl hover:opacity-75"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}

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

  // Standard bg, ebcont border and accent details
  const colorStyle =
    type === "success"
      ? "bg-ebcont-lightmint border-ebcont-darkmint"
      : type === "error"
      ? "bg-red-600 border-ebcont-fuchsia"
      : "bg-ebcont-turquoise border-ebcont-darkmint";

  const icon =
    type === "success" ? (
      <span className="text-ebcont-darkmint">✔</span>
    ) : type === "error" ? (
      <span className="text-ebcont-fuchsia">⚠</span>
    ) : (
      <span className="text-ebcont-darkviolet">ℹ</span>
    );

  return (
    <div
      className={`
    fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999]
    min-w-[300px] max-w-full px-6 py-4
    border-2 shadow-xl font-semibold
    flex items-center gap-4
    ${colorStyle}
    rounded
    transition-all duration-300
    ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
  `}
    >
      <span className="text-2xl">{icon}</span>
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-ebcont-darkviolet text-2xl hover:opacity-60"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}
/* const baseStyle =
    "fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-lg text-white flex items-center space-x-4 transition-all duration-500";

  const colorStyle =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-blue-600";

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
  ); */

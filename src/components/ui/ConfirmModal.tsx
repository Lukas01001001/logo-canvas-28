// components/ui/ConfirmModal.tsx

"use client";

import { useEffect } from "react";

type ConfirmModalProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean; // <-- optional props
};

export default function ConfirmModal({
  message,
  onConfirm,
  onCancel,
  isDeleting = false, // false by default
}: ConfirmModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-ebcont-magnolia p-6 rounded shadow-2xl shadow-ebcont-magnolia border-2 border-ebcont-darkviolet max-w-sm w-full text-center transition-all">
        <p className="mb-4 text-ebcont-darkviolet text-base font-semibold">
          {message}
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="
          px-5 py-2
          border-2 border-ebcont-activviolet text-ebcont-activviolet bg-white hover:bg-ebcont-activviolet hover:text-white 
          font-semibold
          
          shadow
          transition
          disabled:opacity-60 disabled:cursor-not-allowed
          min-w-[100px]
        "
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="
          px-5 py-2
          bg-ebcont-fuchsia
          hover:bg-ebcont-activviolet
          text-white
          font-semibold
          shadow
          transition
          disabled:opacity-60 disabled:cursor-not-allowed
          min-w-[100px]
        "
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

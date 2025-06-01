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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md max-w-sm w-full text-center">
        <p className="mb-4 text-gray-800">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            disabled={isDeleting} // do not allow cancellation during
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

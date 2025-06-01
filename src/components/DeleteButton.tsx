// components/DeleteButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function DeleteButton({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  const router = useRouter();
  const { showToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true); // Block while deleting

    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        showToast("Client deleted successfully.", "success");
        setShowModal(false); // Close modal
        router.push("/clients"); // Transfer to list
      } else {
        showToast(data.error || "Failed to delete client.", "error");
      }
    } catch (error) {
      showToast("Something went wrong.", "error");
    } finally {
      setIsDeleting(false); // Unlock after operation
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-red-600 hover:bg-red-700 font-semibold text-white px-5 py-2 rounded text-center"
      >
        Delete
      </button>

      {showModal && (
        <ConfirmModal
          message={`Are you sure you want to delete ${name}?`}
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
          isDeleting={isDeleting} // <-- state is given
        />
      )}
    </>
  );
}

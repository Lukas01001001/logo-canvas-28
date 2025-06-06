// src/app/industries/page.tsx

"use client";

import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import { useSession } from "next-auth/react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useToast } from "@/context/ToastContext";

type Industry = {
  id: number;
  name: string;
  _count?: { clients: number };
};

export default function IndustriesPage() {
  const { status } = useSession();
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  // Fetch industries
  useEffect(() => {
    fetch("/api/industries")
      .then((res) => res.json())
      .then((data) => setIndustries(data))
      .catch(() => setError("Failed to load industries"))
      .finally(() => setLoading(false));
  }, []);

  // Add industry
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError(null);
    const res = await fetch("/api/industries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    if (res.ok) {
      const added = await res.json();
      setIndustries((prev) => [...prev, { ...added, _count: { clients: 0 } }]);
      setNewName("");
    } else {
      const { error } = await res.json();
      setError(error || "Failed to add industry");
    }
    setAdding(false);
  };

  // Edit industry
  const handleEdit = async (id: number) => {
    setError(null);
    const res = await fetch(`/api/industries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });
    if (res.ok) {
      setIndustries((prev) =>
        prev.map((ind) => (ind.id === id ? { ...ind, name: editName } : ind))
      );
      setEditId(null);
    } else {
      const { error } = await res.json();
      setError(error || "Failed to edit industry");
    }
  };

  // Delete industry
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Function triggered by clicking “Delete” on the industry
  const handleDeleteClick = (id: number) => {
    setConfirmDeleteId(id);
  };

  // Function called on approval in modal
  const confirmDelete = async () => {
    if (confirmDeleteId === null) return;
    setIsDeleting(true);
    setError(null);
    const res = await fetch(`/api/industries/${confirmDeleteId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setIndustries((prev) => prev.filter((ind) => ind.id !== confirmDeleteId));
      setConfirmDeleteId(null);
      showToast("Industry deleted successfully.", "success");
    } else {
      const { error } = await res.json();
      setError(error || "Failed to delete industry");
      showToast(error || "Failed to delete industry", "error");
    }
    setIsDeleting(false);
  };

  // Function to close the modal (without deleting)
  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  if (status === "loading" || loading)
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Spinner />
      </main>
    );

  return (
    <main className="max-w-2xl mx-auto p-6 mt-12 bg-gray-900 rounded-xl shadow text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Industries</h1>

      <form onSubmit={handleAdd} className="flex gap-2 mb-8">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Add new industry"
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          minLength={2}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow font-semibold"
          disabled={adding}
        >
          {adding ? "Adding..." : "Add"}
        </button>
      </form>

      {error && <div className="mb-4 text-red-400">{error}</div>}

      <ul className="divide-y divide-gray-700">
        {industries.map((industry) => (
          <li
            key={industry.id}
            className="flex items-center justify-between py-3"
          >
            {editId === industry.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 px-3 py-1 bg-gray-800 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 outline-none mr-2"
                />
                <button
                  className="bg-blue-600 px-3 py-1 rounded font-semibold mr-2"
                  onClick={() => handleEdit(industry.id)}
                  disabled={editName.trim().length < 2}
                  type="button"
                >
                  Save
                </button>
                <button
                  className="text-gray-400 hover:text-red-400"
                  onClick={() => setEditId(null)}
                  type="button"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="flex-1">
                  {industry.name}
                  <span className="text-xs text-gray-400 ml-3">
                    {industry._count?.clients ?? 0} clients
                  </span>
                </span>
                <button
                  className="text-blue-400 hover:text-blue-200 mr-2"
                  onClick={() => {
                    setEditId(industry.id);
                    setEditName(industry.name);
                  }}
                >
                  Edit
                </button>
                <button
                  className={`text-red-400 hover:text-red-600 ${
                    industry._count?.clients
                      ? "opacity-40 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={!!industry._count?.clients}
                  onClick={() =>
                    !industry._count?.clients && handleDeleteClick(industry.id)
                  }
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      {confirmDeleteId !== null && (
        <ConfirmModal
          message="Are you sure you want to delete this industry? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          isDeleting={isDeleting}
        />
      )}
    </main>
  );
}

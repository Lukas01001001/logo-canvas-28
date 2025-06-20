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
    <main className="max-w-2xl mx-auto py-12 px-4">
      {/*  */}
      <div
        className="
    p-8 bg-ebcont-magnolia border-2 border-ebcont-darkviolet
    shadow-2xl shadow-ebcont-darkviolet rounded
    text-ebcont-darkviolet
    space-y-8
  "
      >
        <h1 className="text-3xl text-ebcont-darkviolet font-bold mb-8 text-center tracking-tight">
          Manage Industries
        </h1>

        {/* ADD FORM */}
        <form
          onSubmit={handleAdd}
          className="flex flex-col sm:flex-row gap-3 items-center w-full"
        >
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Add new industry"
            minLength={2}
            required
            className="
        flex-1 w-full px-4 py-2
        bg-white text-ebcont-darkviolet
        border border-ebcont-darkviolet rounded-none
        font-medium placeholder-ebcont-activviolet/80
        focus:outline-none focus:ring-2 focus:ring-ebcont-activviolet
        transition
      "
          />
          <button
            type="submit"
            className="
            w-full sm:w-auto
        bg-ebcont-activviolet hover:bg-ebcont-activvioletdeep
        text-white font-semibold
        px-6 py-2 shadow transition min-w-[180px]
        disabled:opacity-60 disabled:cursor-not-allowed
      "
            disabled={adding}
          >
            {adding ? "Adding..." : "Add Industry"}
          </button>
        </form>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-ebcont-fuchsia font-semibold text-sm text-center">
            {error}
          </div>
        )}

        {/* LIST */}
        <ul className="space-y-3">
          {industries.map((industry) => (
            <li
              key={industry.id}
              className="
          flex flex-col sm:flex-row items-center justify-between gap-3 py-3 px-4
          bg-white border border-ebcont-darkviolet rounded-none
          shadow-lg shadow-ebcont-darkviolet transition-all
        "
            >
              {editId === industry.id ? (
                <div className="flex-1 flex flex-col sm:flex-row items-center gap-3 w-full">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter industry"
                    className="
                    w-full sm:w-auto
                flex-1 px-3 py-1
                bg-ebcont-magnolia text-ebcont-darkviolet
                border border-ebcont-darkviolet rounded-none
                font-medium
                focus:outline-none focus:ring-2 focus:ring-ebcont-activviolet
                placeholder-ebcont-activviolet/80
                transition
              "
                  />
                  <button
                    className="
                bg-ebcont-activviolet hover:bg-ebcont-fuchsia
                text-white font-semibold px-4 py-1 shadow transition mr-2
                disabled:opacity-60 disabled:cursor-not-allowed
              "
                    onClick={() => handleEdit(industry.id)}
                    disabled={editName.trim().length < 2}
                    type="button"
                  >
                    Save
                  </button>
                  <button
                    className="
                text-ebcont-darkviolet hover:text-ebcont-fuchsia
                font-semibold px-2 transition
              "
                    onClick={() => setEditId(null)}
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col sm:flex-row items-center gap-4">
                  <span className="flex-1 flex items-center gap-2 font-medium">
                    {industry.name}
                    <span
                      className="
                ml-3 px-3 py-0.5 rounded-full bg-ebcont-mint text-xs text-ebcont-darkviolet font-semibold
              "
                    >
                      {industry._count?.clients ?? 0} clients
                    </span>
                  </span>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <button
                      className="
                text-ebcont-activviolet hover:text-ebcont-fuchsia
                font-semibold px-2 transition mr-1
              "
                      onClick={() => {
                        setEditId(industry.id);
                        setEditName(industry.name);
                      }}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className={`
                text-ebcont-fuchsia hover:text-ebcont-activviolet font-semibold px-2 transition
                ${
                  industry._count?.clients
                    ? "opacity-40 cursor-not-allowed"
                    : ""
                }
              `}
                      disabled={!!industry._count?.clients}
                      onClick={() =>
                        !industry._count?.clients &&
                        handleDeleteClick(industry.id)
                      }
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* MODAL DELETE */}
        {confirmDeleteId !== null && (
          <ConfirmModal
            message="Are you sure you want to delete this industry? This action cannot be undone."
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            isDeleting={isDeleting}
          />
        )}
      </div>
    </main>
  );
}

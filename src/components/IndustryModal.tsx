// src/components/IndustryModal.tsx

"use client";

import { useState } from "react";

type Industry = {
  id: number;
  name: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onIndustryAdded: (industry: Industry) => void;
};

export default function IndustryModal({
  isOpen,
  onClose,
  onIndustryAdded,
}: Props) {
  const [industryName, setIndustryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    setError("");
    if (industryName.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/industries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: industryName.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        onIndustryAdded(data.industry);
        setIndustryName("");
        onClose();
      } else {
        setError(data.error || "Failed to add industry.");
      }
    } catch (err) {
      setError("Error connecting to server.");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4 text-blue-900">
          Add Industry
        </h2>
        <input
          type="text"
          value={industryName}
          onChange={(e) => setIndustryName(e.target.value)}
          placeholder="Industry name"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-3"
          disabled={loading}
          autoFocus
        />
        {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
        <button
          onClick={handleAdd}
          disabled={loading}
          className="w-full py-2 bg-blue-900 hover:bg-blue-800 text-white rounded font-semibold"
        >
          {loading ? "Saving..." : "Add"}
        </button>
      </div>
    </div>
  );
}

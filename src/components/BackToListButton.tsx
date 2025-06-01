// src/components/BackToListButton.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function BackToListButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = () => {
    const name = searchParams.get("name");
    const industry = searchParams.get("industry");
    const ids = searchParams.get("ids");

    const query = new URLSearchParams();

    if (name) query.set("name", name);
    if (industry) query.set("industry", industry);
    if (ids) query.set("ids", ids);

    router.push(`/clients${query.toString() ? `?${query.toString()}` : ""}`);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 hover:bg-blue-700 font-semibold text-white px-4 py-2 rounded"
    >
      ← Back to List
    </button>
  );
}

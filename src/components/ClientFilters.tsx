// src/components/ClientFilters.tsx

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import debounce from "lodash.debounce"; // npm install lodash.debounce

type Props = {
  availableIndustries: string[];
};

export default function ClientFilters({ availableIndustries }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [name, setName] = useState(searchParams.get("name") || "");
  const [industry, setIndustry] = useState(searchParams.get("industry") || "");

  // Update with debounce and cancel
  const updateQuery = useCallback(
    debounce((newName: string, newIndustry: string) => {
      const params = new URLSearchParams();
      if (newName) params.set("name", newName);
      if (newIndustry) params.set("industry", newIndustry);
      router.push(`${pathname}?${params.toString()}`);
    }, 300),
    [router, pathname]
  );

  useEffect(() => {
    updateQuery(name, industry);

    // 💣 Most important: cancel debounce on unmount
    return () => {
      updateQuery.cancel();
    };
  }, [name, industry, updateQuery]);

  const handleClear = () => {
    setName("");
    setIndustry("");
    router.push(pathname); // delete query params
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <input
        type="search"
        placeholder="Search by name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full md:w-1/2 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
        className="w-full md:w-1/4 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All industries</option>
        {availableIndustries.map((ind) => (
          <option key={ind} value={ind} className="bg-gray-800 text-white">
            {ind}
          </option>
        ))}
      </select>

      <button
        onClick={handleClear}
        className="border border-yellow-500 text-yellow-500 font-semibold hover:bg-gray-700 hover:text-white p-2 rounded-md md:w-auto"
      >
        Clear Filters
      </button>
    </div>
  );
}

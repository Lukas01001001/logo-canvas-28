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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        className="
      w-full md:w-1/2
      border border-ebcont-darkviolet
      bg-white
      text-ebcont-darkviolet
      placeholder-ebcont-darkviolet
      p-2
      font-medium
      focus:outline-none
      focus:ring-2 focus:ring-ebcont-activviolet
      transition
      shadow-sm
    "
      />

      <select
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
        className="
      w-full md:w-1/4
      border border-ebcont-darkviolet
      bg-white
      text-ebcont-darkviolet
      p-2
      font-medium
      focus:outline-none
      focus:ring-2 focus:ring-ebcont-activviolet
      transition
      shadow-sm
      placeholder-ebcont-turquoise
    "
      >
        <option value="">All industries</option>
        {availableIndustries.map((ind) => (
          <option
            key={ind}
            value={ind}
            className="bg-white text-ebcont-darkviolet"
          >
            {ind}
          </option>
        ))}
      </select>

      <button
        onClick={handleClear}
        className="
      border-2 border-ebcont-fuchsia
      text-ebcont-fuchsia
      bg-white
      font-semibold
      px-4 py-2
      hover:bg-ebcont-fuchsia hover:text-white
      shadow-sm
      transition
      md:w-auto
    "
      >
        Clear Filters
      </button>
    </div>
  );
}

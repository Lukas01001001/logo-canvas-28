// src/components/ClientCard.tsx

"use client";

import Link from "next/link";
import { useMemo } from "react";

type Props = {
  id: number;
  name: string;
  industry?: string | null;
  logoBlob?: string | null;
  logoType?: string | null;
  selected: boolean;
  toggle: () => void;
  queryString: string;
  selectedIds: number[]; // <--
};

export default function ClientCard({
  id,
  name,
  industry,
  logoBlob,
  logoType,
  selected,
  toggle,
  queryString,
  selectedIds, // <-
}: Props) {
  const linkHref = useMemo(() => {
    const query = new URLSearchParams(queryString);
    if (selectedIds.length > 0) {
      query.set("ids", selectedIds.join(","));
    }
    return `/clients/${id}${query.toString() ? `?${query.toString()}` : ""}`;
  }, [id, queryString, selectedIds]);

  const logoUrl =
    logoBlob && logoType ? `data:${logoType};base64,${logoBlob}` : null;

  return (
    <div
      className={`flex items-center gap-2 md:gap-6 border rounded-none shadow bg-white hover:bg-ebcont-magnolia transition p-4 cursor-pointer group ${
        selected
          ? "ring-2 ring-ebcont-darkviolet border-ebcont-darkviolet"
          : "border-2 border-ebcont-darkviolet"
      }`}
      onClick={(e) => {
        // Allows you to click the entire tab, but not capture the link click
        if (!(e.target as HTMLElement).closest("a")) {
          toggle();
        }
      }}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") toggle();
      }}
      aria-checked={selected}
      role="checkbox"
      aria-label={`Select client ${name}${
        industry ? ` from industry ${industry}` : ""
      }`}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={toggle}
        className="w-14 h-14 accent-ebcont-mint border-2 border-ebcont-darkviolet
      rounded-xl
      shadow
      cursor-pointer
      focus:ring-4 focus:ring-ebcont-activviolet
      transition"
        title="Select client"
        aria-label={`Select client ${name}${
          industry ? ` from industry ${industry}` : ""
        }`}
        onClick={(e) => e.stopPropagation()} // prevents double toggle
      />

      <Link
        href={linkHref}
        className="flex items-center gap-4 flex-1"
        tabIndex={-1}
        draggable={false}
      >
        {logoUrl ? (
          <div className="mx-4 md:mx-8 border-4 border-white shadow-lg shadow-ebcont-darkviolet">
            <img
              src={logoUrl}
              alt={`${name} logo`}
              className="w-28 h-20 object-contain bg-white"
            />
          </div>
        ) : (
          <div
            className="w-20 h-20 flex items-center justify-center text-base font-semibold rounded shadow
        bg-ebcont-turquoise text-ebcont-darkviolet"
          >
            No Logo
          </div>
        )}
        <div className="min-w-0">
          <p className="text-lg font-semibold text-ebcont-darkviolet truncate">
            {name}
          </p>
          {industry && (
            <p className="text-sm text-ebcont-darkviolet truncate">
              {industry}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}

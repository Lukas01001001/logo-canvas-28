// src/components/ClientListHeader.tsx

"use client";

import { List, LayoutGrid } from "lucide-react";

type Props = {
  selectedCount: number;
  onReset: () => void;
  onGenerate: () => void;
  layout: "grid" | "list";
  onToggleLayout: () => void;
  onSelectAll: () => void;
  allSelected: boolean;
};

export default function ClientListHeader({
  selectedCount,
  onReset,
  onGenerate,
  layout,
  onToggleLayout,
  onSelectAll,
  allSelected,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
      {/* <h1 className="text-3xl font-bold text-white">Client List</h1> */}

      <div className="flex flex-wrap gap-4">
        <button
          onClick={onToggleLayout}
          className="hidden sm:inline-flex items-center gap-2 bg-ebcont-darkviolet hover:bg-ebcont-deepviolet
           text-white font-semibold py-2 px-4 shadow transition"
        >
          {layout === "grid" ? (
            <>
              <List className="w-4 h-4" />
              List View
            </>
          ) : (
            <>
              <LayoutGrid className="w-4 h-4" />
              Grid View
            </>
          )}
        </button>
        <button
          onClick={onSelectAll}
          className="w-full sm:w-auto bg-ebcont-fuchsia hover:bg-ebcont-activvioletdark text-white 
          font-semibold py-2 px-4 min-w-[120px] shadow transition"
        >
          {allSelected ? "Deselect All" : "Select All"}
        </button>

        {selectedCount > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={onReset}
              className="w-full sm:w-auto border-2 border-ebcont-fuchsia text-ebcont-fuchsia bg-white hover:bg-ebcont-fuchsia hover:text-white 
              font-semibold py-2 px-4 shadow transition"
            >
              Reset Checkbox
            </button>

            <button
              onClick={onGenerate}
              className="w-full sm:w-auto bg-ebcont-activviolet hover:bg-ebcont-fuchsia text-white font-semibold py-2 px-4 shadow transition"
            >
              Generate Logo Forest
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

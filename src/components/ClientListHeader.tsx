// src/components/ClientListHeader.tsx

"use client";

import { List, LayoutGrid } from "lucide-react";

type Props = {
  selectedCount: number;
  onReset: () => void;
  onGenerate: () => void;
  layout: "grid" | "list";
  onToggleLayout: () => void;
};

export default function ClientListHeader({
  selectedCount,
  onReset,
  onGenerate,
  layout,
  onToggleLayout,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
      {/* <h1 className="text-3xl font-bold text-white">Client List</h1> */}

      <div className="flex flex-wrap gap-4">
        <button
          onClick={onToggleLayout}
          className="hidden sm:inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition"
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

        {selectedCount > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={onReset}
              className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-md"
            >
              Reset Checkbox
            </button>

            <button
              onClick={onGenerate}
              className="w-full sm:w-auto bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-md"
            >
              Generate Logo Forest
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

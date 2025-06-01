// src/components/ui/Spinner.tsx

"use client";

export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative h-32 w-32 mb-4">
        {/* Background */}
        <div className="absolute inset-0 rounded-full bg-[#000000]"></div>
        {/* Spinner */}
        <div className="animate-spin rounded-full h-32 w-32 border-t-8 border-[#f7931a] border-opacity-90"></div>
      </div>
      <p className="text-white text-lg font-bold opacity-90">
        Loading clients...
      </p>
    </div>
  );
}

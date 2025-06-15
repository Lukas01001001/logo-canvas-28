// src/components/AddClientsButton.tsx

"use client";
import { useState } from "react";
import { AddClientsModal } from "./AddClientsModal";

export function AddClientsButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        /* className="
    bg-ebcont-activviolet hover:bg-ebcont-fuchsia
    h-12 min-w-[140px] md:text-lg
    text-white font-semibold px-6 py-2
    shadow transition
    focus:outline-none focus:ring-2 focus:ring-ebcont-darkmint
  " */
        className="
    bg-white
    border-2 border-ebcont-activviolet
    text-ebcont-activviolet
    h-12 min-w-[140px] md:text-lg
    font-semibold px-6 py-2
    shadow transition
    hover:bg-ebcont-activviolet hover:text-white
    focus:outline-none focus:ring-2 focus:ring-ebcont-darkmint
  "
      >
        Add Clients
      </button>
      <AddClientsModal open={open} setOpen={setOpen} />
    </>
  );
}

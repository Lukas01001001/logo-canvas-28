// src/components/AddClientsButton.tsx

"use client";
import { useState } from "react";
import { AddClientsModal } from "./AddClientsModal";
import { Button } from "@/components/ui/button";

export function AddClientsButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-blue-700">
        Add Clients
      </Button>
      <AddClientsModal open={open} setOpen={setOpen} />
    </>
  );
}

// src/components/AddClientsModal.tsx

"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ClientListModal } from "./ClientListModal";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  children?: React.ReactNode;
};

export function AddClientsModal({ open, setOpen }: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-2 border-ebcont-darkmint bg-ebcont-lightmint rounded w-full max-w-full md:max-w-2xl lg:max-w-3xl max-h-[80vh] flex flex-col justify-between">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-ebcont-darkviolet tracking-tight">
            Add clients to canvas
          </DialogTitle>
          <DialogDescription className="text-ebcont-darkviolet">
            Select clients to add to the canvas.
          </DialogDescription>
        </DialogHeader>
        <ClientListModal onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

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
      <DialogContent className="md:max-w-xl w-full max-h-[80vh] flex flex-col justify-between">
        <DialogHeader>
          <DialogTitle>Add clients to canvas</DialogTitle>
          <DialogDescription>
            Select clients to add to the canvas.
          </DialogDescription>
        </DialogHeader>
        <ClientListModal onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

// src/components/ConfirmPlacementDialog.tsx

"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onSelect: (option: "keep" | "random") => void;
  onCancel: () => void;
};

export function ConfirmPlacementDialog({ open, onSelect, onCancel }: Props) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent
        className="
          rounded
          border-2 border-ebcont-darkviolet
          bg-ebcont-magnolia
          shadow-2xl shadow-ebcont-darkviolet
          w-full max-w-md p-0
        "
      >
        <DialogHeader className="p-4">
          <DialogTitle className="text-ebcont-darkviolet text-xl font-bold">
            Logo placement
          </DialogTitle>

          <DialogDescription className="text-ebcont-darkviolet">
            How do you want to arrange logos on the canvas?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 px-6 py-4">
          <Button
            variant="outline"
            onClick={() => onSelect("keep")}
            className="
              rounded-none w-full
              bg-ebcont-activviolet
              text-white font-semibold
              hover:bg-white hover:text-ebcont-activviolet hover:border-2 hover:border-ebcont-activviolet
              transition
            "
          >
            Keep current positions
          </Button>
          <Button
            variant="outline"
            onClick={() => onSelect("random")}
            className="
              rounded-none w-full
              bg-ebcont-activviolet
              text-white font-semibold
              hover:bg-white hover:text-ebcont-activviolet hover:border-2 hover:border-ebcont-activviolet
              transition
            "
          >
            Randomly arrange all logos
          </Button>
        </div>
        <DialogFooter className="px-6 pb-6 flex !justify-center">
          <Button
            variant="outline"
            onClick={onCancel}
            className="
      rounded-none
      border-2 border-ebcont-activviolet
      text-ebcont-activviolet font-semibold
      bg-white
      hover:bg-ebcont-activviolet hover:text-white
      transition
    "
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

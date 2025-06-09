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
      <DialogContent className="rounded bg-[#181c23]">
        <DialogHeader>
          <DialogTitle className="text-white text-lg font-bold">
            Logo placement
          </DialogTitle>

          <DialogDescription className="text-white">
            How do you want to arrange logos on the canvas?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-3">
          <Button
            variant="outline"
            onClick={() => onSelect("keep")}
            className="rounded w-full border-2 border-blue-600 text-blue-400 font-semibold hover:bg-blue-600 hover:text-white transition"
          >
            Keep current positions
          </Button>
          <Button
            variant="outline"
            onClick={() => onSelect("random")}
            className="rounded w-full border-2 border-white-600 text-white-400 font-semibold hover:bg-gray-100 hover:text-black transition"
          >
            Randomly arrange all logos
          </Button>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            className="rounded w-full border-2 border-white text-white font-semibold hover:bg-gray-100 hover:text-black transition"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

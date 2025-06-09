// src/hooks/useConfirmPlacement.tsx

import { useState } from "react";
import { ConfirmPlacementDialog } from "@/components/ConfirmPlacementDialog";

export function useConfirmPlacementDialog(): [
  (options?: { open?: boolean }) => Promise<"keep" | "random" | "cancel">,
  React.ReactNode
] {
  const [open, setOpen] = useState(false);
  const [resolver, setResolver] = useState<null | ((v: any) => void)>(null);

  const show = () => {
    setOpen(true);
    return new Promise<"keep" | "random" | "cancel">((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleSelect = (option: "keep" | "random") => {
    setOpen(false);
    if (resolver) resolver(option);
    setResolver(null);
  };
  const handleCancel = () => {
    setOpen(false);
    if (resolver) resolver("cancel");
    setResolver(null);
  };

  const dialog = (
    <ConfirmPlacementDialog
      open={open}
      onSelect={handleSelect}
      onCancel={handleCancel}
    />
  );

  return [show, dialog];
}

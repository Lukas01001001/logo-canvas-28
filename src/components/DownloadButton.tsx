// src/components/DownloadButton.tsx

"use client";

import { toPng } from "html-to-image";
import { useToast } from "@/context/ToastContext";

export default function DownloadButton() {
  const { showToast } = useToast();

  const handleDownload = async () => {
    const node = document.getElementById("logo-canvas");
    if (!node) return;

    // Temporarily hide checkboxes and borders for clean PNG export
    // add CSS class export-mode
    document.body.classList.add("export-mode");

    // deactivate overflow
    const prevOverflow = node.style.overflow;
    node.style.overflow = "hidden";

    try {
      const dataUrl = await toPng(node);
      const link = document.createElement("a");
      link.download = "logo-forest.png";
      link.href = dataUrl;
      link.click();

      showToast("Saved!", "success");
    } catch (error) {
      showToast("Download failed", "error");
      console.error("Download error", error);
    } finally {
      // previous style
      node.style.overflow = prevOverflow;

      // Safely remove the class when the export is ready.
      setTimeout(() => {
        document.body.classList.remove("export-mode");
      }, 1000);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="
    bg-ebcont-activviolet hover:bg-ebcont-fuchsia
    text-white font-semibold
    h-12 min-w-[140px] md:text-lg
    px-6 py-2 shadow transition
    focus:outline-none focus:ring-2 focus:ring-ebcont-darkmint
  "
    >
      Download PNG
    </button>
  );
}

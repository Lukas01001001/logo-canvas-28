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
      className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all text-base md:text-lg"
    >
      Download PNG
    </button>
  );
}

// src/store/useCanvasStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

type PositionAndSize = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type CanvasStore = {
  userSetCanvasSize: boolean;
  canvasWidth: number;
  canvasHeight: number;
  canvasBg: "black" | "white";
  logoBackgrounds: Record<number, "black" | "white">;
  layout: Record<number, PositionAndSize>;
  selectedIds: number[];
  setCanvas: (
    partial: Partial<Omit<CanvasStore, "setCanvas" | "resetCanvas">>
  ) => void;
  resetCanvas: (clientIds: number[]) => void;
};

export const useCanvasStore = create<CanvasStore>()(
  persist(
    (set) => ({
      canvasWidth: 1200,
      canvasHeight: 600,
      canvasBg: "black",
      logoBackgrounds: {},
      layout: {},
      selectedIds: [],
      userSetCanvasSize: false, // MUST BE set to default false
      setCanvas: (partial) => set((state) => ({ ...state, ...partial })),
      resetCanvas: (clientIds) =>
        set((state) => {
          const layout: Record<number, PositionAndSize> = {};
          const logoBackgrounds: Record<number, "black" | "white"> = {};
          clientIds.forEach((id, idx) => {
            layout[id] = { x: 30 + idx * 10, y: 30, width: 100, height: 100 };
            logoBackgrounds[id] = "black";
          });
          return {
            ...state,
            logoBackgrounds,
            layout,
            selectedIds: [],
            userSetCanvasSize: false, // resets to auto
          };
        }),
    }),
    { name: "logo-canvas-store" }
  )
);

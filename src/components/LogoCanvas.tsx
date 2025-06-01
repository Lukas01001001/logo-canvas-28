//src/components/LogoCanvas.tsx

"use client";

import { useEffect, useState, useRef } from "react";
import { Rnd } from "react-rnd";
import { useCanvasStore } from "@/store/useCanvasStore";

// Types transferred from props
type Client = {
  id: number;
  name: string;
  logoBlob: string | null;
  logoType: string | null;
};
type Props = { clients: Client[] };
type PositionAndSize = { x: number; y: number; width: number; height: number };

const MIN_SIZE = 240;
const MAX_SIZE = 2500;

// Hook to auto-size canvas when user doesn't set manually
//function useResponsiveCanvasSize(canvasRef: React.RefObject<HTMLDivElement>) {
function useResponsiveCanvasSize(
  canvasRef: React.RefObject<HTMLDivElement | null>
) {
  const setCanvas = useCanvasStore((s) => s.setCanvas);
  const userSetCanvasSize = useCanvasStore((s) => s.userSetCanvasSize);

  // Recalculate on input and at window resize when no size is forced
  useEffect(() => {
    if (userSetCanvasSize) return;
    const updateSize = () => {
      if (userSetCanvasSize) return;
      const width = canvasRef.current
        ? canvasRef.current.offsetWidth
        : Math.min(window.innerWidth * 0.95, 1200);
      const height = Math.max(MIN_SIZE, Math.round(width * 0.5));
      setCanvas({ canvasWidth: Math.round(width), canvasHeight: height });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [setCanvas, userSetCanvasSize, canvasRef]);

  // Recalculate on return to auto
  useEffect(() => {
    if (!userSetCanvasSize) {
      const width = canvasRef.current
        ? canvasRef.current.offsetWidth
        : Math.min(window.innerWidth * 0.95, 1200);
      const height = Math.max(MIN_SIZE, Math.round(width * 0.5));
      setCanvas({ canvasWidth: Math.round(width), canvasHeight: height });
    }
    // eslint-disable-next-line
  }, [userSetCanvasSize]);
}

export default function LogoCanvas({ clients }: Props) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  useResponsiveCanvasSize(canvasRef);

  const {
    canvasWidth,
    canvasHeight,
    canvasBg,
    logoBackgrounds,
    layout,
    selectedIds,
    setCanvas,
    resetCanvas,
    userSetCanvasSize,
  } = useCanvasStore();

  // Automatic number inputs (no zeros left, no 1, 2, 0, etc)
  const [widthInput, setWidthInput] = useState(canvasWidth.toString());
  const [heightInput, setHeightInput] = useState(canvasHeight.toString());

  useEffect(() => setWidthInput(canvasWidth.toString()), [canvasWidth]);
  useEffect(() => setHeightInput(canvasHeight.toString()), [canvasHeight]);

  // Input handling, UX
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/^0+/, "");
    setWidthInput(val);
    const num = Number(val);
    if (!isNaN(num) && num >= MIN_SIZE && num <= MAX_SIZE) {
      setCanvas({ canvasWidth: num, userSetCanvasSize: true });
    }
  };
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/^0+/, "");
    setHeightInput(val);
    const num = Number(val);
    if (!isNaN(num) && num >= MIN_SIZE && num <= MAX_SIZE) {
      setCanvas({ canvasHeight: num, userSetCanvasSize: true });
    }
  };
  const handleWidthBlur = () => {
    const num = Number(widthInput);
    if (!widthInput || isNaN(num) || num < MIN_SIZE || num > MAX_SIZE) {
      setCanvas({ canvasWidth: MIN_SIZE, userSetCanvasSize: true });
      setWidthInput(MIN_SIZE.toString());
    }
  };
  const handleHeightBlur = () => {
    const num = Number(heightInput);
    if (!heightInput || isNaN(num) || num < MIN_SIZE || num > MAX_SIZE) {
      setCanvas({ canvasHeight: MIN_SIZE, userSetCanvasSize: true });
      setHeightInput(MIN_SIZE.toString());
    }
  };

  // Reset support (resets layout, logo backgrounds and returns to auto-size)
  const handleReset = () => {
    //setCanvas({ userSetCanvasSize: false });
    setCanvas({ userSetCanvasSize: false, canvasBg: "black" }); // <-- reset canvasBg: "black"
    resetCanvas(clients.map((c) => c.id));
  };

  // Layout support - logo synchronization on canvas (when changing clients)
  useEffect(() => {
    const clientIds = clients.map((c) => c.id);
    const currentLayoutIds = Object.keys(layout).map(Number);

    const missingIds = clientIds.filter((id) => !currentLayoutIds.includes(id));
    const extraIds = currentLayoutIds.filter((id) => !clientIds.includes(id));

    if (missingIds.length > 0 || extraIds.length > 0) {
      // Add missing and remove extra
      const newLayout: Record<number, PositionAndSize> = {};
      let baseIdx = 0;
      clientIds.forEach((id) => {
        if (layout.hasOwnProperty(id)) {
          newLayout[id] = layout[id];
        } else {
          newLayout[id] = {
            x: 30 + (currentLayoutIds.length + baseIdx) * 10,
            y: 30,
            width: 100,
            height: 100,
          };
          baseIdx++;
        }
      });

      const newLogoBackgrounds: Record<number, "black" | "white"> = {};
      clientIds.forEach((id) => {
        if (id in logoBackgrounds) {
          newLogoBackgrounds[id] = logoBackgrounds[id];
        } else {
          newLogoBackgrounds[id] = "black";
        }
      });

      const newSelectedIds = selectedIds.filter((id) => clientIds.includes(id));

      setCanvas({
        layout: newLayout,
        logoBackgrounds: newLogoBackgrounds,
        selectedIds: newSelectedIds,
      });
    }
    // eslint-disable-next-line
  }, [JSON.stringify(clients.map((c) => c.id))]);

  // Drag/resize handling of logos
  const updateClientLayout = (
    id: number,
    changes: Partial<PositionAndSize>
  ) => {
    setCanvas({ layout: { ...layout, [id]: { ...layout[id], ...changes } } });
  };

  // Toggle background canvas
  const toggleCanvasBackground = () => {
    setCanvas({ canvasBg: canvasBg === "black" ? "white" : "black" });
  };

  // Toggle background logos
  const handleToggleLogoBGs = () => {
    const updated = { ...logoBackgrounds };
    selectedIds.forEach((id) => {
      updated[id] = logoBackgrounds[id] === "black" ? "white" : "black";
    });
    setCanvas({ logoBackgrounds: updated });
  };

  // Checkboxes: handling logo selection
  const [dragDisabledId, setDragDisabledId] = useState<number | null>(null);

  const disableDragTemporarily = (id: number) => {
    setDragDisabledId(id);
    setTimeout(() => setDragDisabledId(null), 100);
  };

  const handleToggleAll = () => {
    if (selectedIds.length === clients.length) {
      setCanvas({ selectedIds: [] });
    } else {
      setCanvas({ selectedIds: clients.map((c) => c.id) });
    }
  };
  const handleCheckbox = (id: number) => {
    if (selectedIds.includes(id)) {
      setCanvas({ selectedIds: selectedIds.filter((x) => x !== id) });
    } else {
      setCanvas({ selectedIds: [...selectedIds, id] });
    }
  };

  // === UI ===
  return (
    <div className="mb-8">
      {/* Sliders + inputs + buttons */}
      <div className="flex flex-col lg:flex-row lg:flex-wrap gap-4 mb-4 text-white items-start lg:items-center">
        {/* Height */}
        <div className="flex items-center gap-2 flex-1 w-full">
          <label className="whitespace-nowrap">Canvas Height:</label>
          <input
            type="range"
            min={MIN_SIZE}
            max={MAX_SIZE}
            value={canvasHeight}
            onChange={(e) =>
              setCanvas({
                canvasHeight: Number(e.target.value),
                userSetCanvasSize: true,
              })
            }
            className="flex-1"
          />
          <input
            type="number"
            min={MIN_SIZE}
            max={MAX_SIZE}
            value={heightInput}
            onChange={handleHeightChange}
            onBlur={handleHeightBlur}
            className="w-20 px-2 py-1 rounded text-white border border-amber-50"
          />
          <span>px</span>
        </div>
        {/* Width */}
        <div className="flex items-center gap-2 flex-1 w-full">
          <label className="whitespace-nowrap">Canvas Width:</label>
          <input
            type="range"
            min={MIN_SIZE}
            max={MAX_SIZE}
            value={canvasWidth}
            onChange={(e) =>
              setCanvas({
                canvasWidth: Number(e.target.value),
                userSetCanvasSize: true,
              })
            }
            className="flex-1"
          />
          <input
            type="number"
            min={MIN_SIZE}
            max={MAX_SIZE}
            value={widthInput}
            onChange={handleWidthChange}
            onBlur={handleWidthBlur}
            className="w-20 px-2 py-1 rounded text-white border border-amber-50"
          />
          <span>px</span>
        </div>
        {/* Buttons */}
        <div className="flex flex-col md:flex-row lg:flex-row lg:items-center gap-4 w-full lg:w-auto">
          <button
            onClick={handleToggleLogoBGs}
            className="w-full lg:w-auto bg-purple-700 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded shadow"
          >
            Switch Logo BGs
          </button>
          <button
            onClick={toggleCanvasBackground}
            className="w-full lg:w-auto bg-gray-600 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded shadow"
          >
            {canvasBg === "black" ? "White Canvas" : "Black Canvas"}
          </button>
          <button
            onClick={handleReset}
            className="w-full lg:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded shadow"
          >
            Reset Canvas
          </button>
        </div>
      </div>

      {/* CANVAS */}
      <div
        ref={canvasRef}
        className={`relative border border-yellow-600 rounded overflow-x-auto ${
          canvasBg === "black" ? "bg-black" : "bg-white"
        }`}
        style={
          userSetCanvasSize
            ? { width: canvasWidth, height: canvasHeight }
            : { width: "100%", maxWidth: canvasWidth, height: canvasHeight }
        }
        id="logo-canvas"
      >
        {/* Button: select all/unselect all */}
        <button
          onClick={handleToggleAll}
          className="canvas-toggle-btn absolute top-4 right-4 border border-yellow-600 bg-white/60 text-black  hover:bg-gray-300 font-semibold text-sm px-3 py-1 rounded shadow z-50"
        >
          {selectedIds.length === clients.length
            ? "Deselect All"
            : "Select All"}
        </button>
        {/* LOGO */}
        {clients.map((client) => {
          const base64 =
            client.logoBlob && client.logoType
              ? `data:${client.logoType};base64,${client.logoBlob}`
              : null;
          const pos = layout[client.id];
          return (
            pos && (
              <Rnd
                key={client.id}
                default={pos}
                bounds="parent"
                disableDragging={dragDisabledId === client.id}
                position={{ x: pos.x, y: pos.y }}
                size={{ width: pos.width, height: pos.height }}
                onDragStop={(_, d) =>
                  updateClientLayout(client.id, { x: d.x, y: d.y })
                }
                onResizeStop={(_, __, ref, delta, position) =>
                  updateClientLayout(client.id, {
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                    ...position,
                  })
                }
                className="absolute"
              >
                {base64 ? (
                  <>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(client.id)}
                      onChange={() => handleCheckbox(client.id)}
                      onPointerDown={() => disableDragTemporarily(client.id)}
                      className="absolute top-1 left-1 w-8 h-8 z-10 accent-blue-500 cursor-pointer"
                    />
                    <img
                      src={base64}
                      alt={client.name}
                      className={`w-full h-full object-contain border-2 border-white rounded ${
                        logoBackgrounds[client.id] === "white"
                          ? "bg-white"
                          : "bg-black"
                      }`}
                    />
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-sm text-gray-700">
                    No Logo
                  </div>
                )}
              </Rnd>
            )
          );
        })}
      </div>
    </div>
  );
}

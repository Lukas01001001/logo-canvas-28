//src/components/LogoCanvas.tsx

"use client";

import { useEffect, useState, useRef } from "react";
import { Rnd } from "react-rnd";
import { useCanvasStore } from "@/store/useCanvasStore";
import { generateClusteredLayout } from "@/utils/clusteredRandomLogoPlacement";
import Spinner from "./ui/Spinner";

// Types transferred from props
type Client = {
  id: number;
  name: string;
  industryId: number | null | undefined;
  industry?: string | null;
  logoBlob: string | null;
  logoType: string | null;
};

type Industry = { id: number; name: string };

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

  // reset support (resets layout, logo backgrounds and returns to auto-size)
  const handleReset = () => {
    setCanvas({ userSetCanvasSize: false });
    //setCanvas({ userSetCanvasSize: false, canvasBg: "black" }); // <-- reset canvasBg: "black"
    resetCanvas(clients.map((c) => c.id));
  };

  const [industryMap, setIndustryMap] = useState<Record<number, string>>({});
  const clientsWithIndustry = clients.map((client) => ({
    ...client,
    industry: client.industryId
      ? industryMap[client.industryId] || "other"
      : "other",
  }));

  useEffect(() => {
    fetch("/api/industries")
      .then((r) => r.json())
      .then((industries: Industry[]) => {
        const map: Record<number, string> = {};
        industries.forEach((ind) => {
          map[ind.id] = ind.name;
        });
        setIndustryMap(map);
      });
  }, []);

  // >>>>>>>> group placements at first reneder <<<<<<<<<
  useEffect(() => {
    // If layout empty (no layout) - set by industry
    if (
      Object.keys(layout).length === 0 &&
      Object.keys(industryMap).length > 0 &&
      clients.length > 0
    ) {
      setCanvas({
        layout: generateClusteredLayout(
          clientsWithIndustry,
          canvasWidth,
          canvasHeight
        ),
        logoBackgrounds: Object.fromEntries(
          clients.map((c) => [c.id, "white"])
        ),
        selectedIds: clients.map((c) => c.id),
      });
    }
    // eslint-disable-next-line
  }, [industryMap, clients.length]);

  // random-mix logo button on canvas
  const handleMixLayout = () => {
    const margin = 2;
    const logoWidth = 100;
    const logoHeight = 100;
    const clientIds = clients.map((c) => c.id);
    const newLayout: Record<number, PositionAndSize> = {};

    function getRandomInt(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function hasCollision(
      newBox: PositionAndSize,
      boxes: PositionAndSize[],
      margin = 8
    ) {
      return boxes.some((box) => {
        return (
          newBox.x < box.x + box.width + margin &&
          newBox.x + newBox.width + margin > box.x &&
          newBox.y < box.y + box.height + margin &&
          newBox.y + newBox.height + margin > box.y
        );
      });
    }

    clientIds.forEach((id) => {
      let tries = 0;
      let pos: PositionAndSize;
      const boxes = Object.values(newLayout);

      const maxX = Math.max(margin, canvasWidth - logoWidth);
      const maxY = Math.max(margin, canvasHeight - logoHeight);

      do {
        pos = {
          x: getRandomInt(margin, maxX),
          y: getRandomInt(margin, maxY),
          width: logoWidth,
          height: logoHeight,
        };
        tries++;
      } while (hasCollision(pos, boxes) && tries < 100);

      newLayout[id] = pos;
    });

    setCanvas({
      layout: newLayout,
      logoBackgrounds: Object.fromEntries(clients.map((c) => [c.id, "white"])),
      selectedIds: clientIds,
    });
  };

  //<<<<<<<<<<<<<<<<<< CANVAS SYNCHRONIZATION !!!!!!!! >>>>>>>>>>>>>>>>>>>>>>>
  // Layout support - logo synchronization on canvas (when changing clients)
  useEffect(() => {
    if (Object.keys(industryMap).length === 0) return; // DODAJ TO!
    const clientIds = clients.map((c) => c.id);
    const currentLayoutIds = Object.keys(layout).map(Number);

    const missingIds = clientIds.filter((id) => !currentLayoutIds.includes(id));
    const extraIds = currentLayoutIds.filter((id) => !clientIds.includes(id));

    //<<<<<<<<<<<<<<<<<< CANVAS RANDOM >>>>>>>>>>>>>>>>>>>>>>>
    function getRandomInt(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // Function checks collision of rectangles with small margin
    function hasCollision(
      newBox: PositionAndSize,
      boxes: PositionAndSize[],
      margin = 8
    ) {
      return boxes.some((box) => {
        return (
          newBox.x < box.x + box.width + margin &&
          newBox.x + newBox.width + margin > box.x &&
          newBox.y < box.y + box.height + margin &&
          newBox.y + newBox.height + margin > box.y
        );
      });
    }
    if (missingIds.length > 0 || extraIds.length > 0) {
      const newLayout: Record<number, PositionAndSize> = {};
      const margin = 2; // BUFFER from the edge
      // First, add the already existing
      clientIds.forEach((id) => {
        if (layout.hasOwnProperty(id)) {
          newLayout[id] = layout[id];
        }
      });

      // Randomly place the missing ones, avoiding collisions and edges!
      missingIds.forEach((id) => {
        const logoWidth = 100;
        const logoHeight = 100;
        const maxX = Math.max(margin, canvasWidth - logoWidth);
        const maxY = Math.max(margin, canvasHeight - logoHeight);

        let tries = 0;
        let pos: PositionAndSize;
        const boxes = Object.values(newLayout);

        // We are looking for positions without collisions (max 100 attempts, so as not to loop)
        do {
          pos = {
            x: getRandomInt(margin, maxX),
            y: getRandomInt(margin, maxY),
            width: logoWidth,
            height: logoHeight,
          };
          tries++;
        } while (hasCollision(pos, boxes) && tries < 100);

        newLayout[id] = pos;
      });

      const newLogoBackgrounds: Record<number, "black" | "white"> = {};
      clientIds.forEach((id) => {
        if (id in logoBackgrounds) {
          newLogoBackgrounds[id] = logoBackgrounds[id];
        } else {
          newLogoBackgrounds[id] = "white";
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
  }, [JSON.stringify(clients.map((c) => c.id)), canvasWidth, canvasHeight]);

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

  // button to place logos in groups
  const handleClusteredLayout = () => {
    const logoBackgrounds: Record<number, "black" | "white"> = {};
    clients.forEach((c) => {
      logoBackgrounds[c.id] = "white";
    });
    setCanvas({
      layout: generateClusteredLayout(
        clientsWithIndustry,
        canvasWidth,
        canvasHeight
      ),
      logoBackgrounds,
      selectedIds: clients.map((c) => c.id),
    });
  };

  // Show a loading spinner while industry map (industries list) is being fetched.
  // This prevents rendering the canvas until all industry data is available.
  if (Object.keys(industryMap).length === 0) {
    return <Spinner />;
  }
  // === UI ===
  return (
    <div className="mb-8">
      {/* Sliders + inputs + buttons */}
      <div className="flex flex-col lg:flex-row lg:flex-wrap gap-4 mb-4 text-ebcont-darkviolet items-start lg:items-center">
        {/* Height */}
        <div className="flex items-center gap-2 flex-1 w-full">
          <label className="whitespace-nowrap font-semibold">
            Canvas Height:
          </label>
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
            className="flex-1 accent-ebcont-darkmint"
          />
          <input
            type="number"
            min={MIN_SIZE}
            max={MAX_SIZE}
            value={heightInput}
            onChange={handleHeightChange}
            onBlur={handleHeightBlur}
            className="
        w-20 px-2 py-1 rounded
        bg-white text-ebcont-darkviolet
        border-2 border-ebcont-darkmint font-semibold
        focus:outline-none focus:ring-2 focus:ring-ebcont-activviolet
      "
          />
          <span>px</span>
        </div>
        {/* Width */}
        <div className="flex items-center gap-2 flex-1 w-full">
          <label className="whitespace-nowrap font-semibold">
            Canvas Width:
          </label>
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
            className="flex-1 accent-ebcont-darkmint"
          />
          <input
            type="number"
            min={MIN_SIZE}
            max={MAX_SIZE}
            value={widthInput}
            onChange={handleWidthChange}
            onBlur={handleWidthBlur}
            className="
        w-20 px-2 py-1 rounded
        bg-white text-ebcont-darkviolet
        border-2 border-ebcont-darkmint font-semibold
        focus:outline-none focus:ring-2 focus:ring-ebcont-activviolet
      "
          />
          <span>px</span>
        </div>
        {/* Buttons (Grid magic) */}
        <div className="flex flex-col md:flex-row flex-wrap gap-3 w-full sm:w-auto">
          <button
            onClick={handleToggleLogoBGs}
            className="flex-1 sm:w-[160px] bg-ebcont-activvioletdark hover:bg-ebcont-activviolet
        text-white font-semibold px-4 py-2 shadow transition"
          >
            Switch Logo BGs
          </button>
          <button
            onClick={toggleCanvasBackground}
            className="flex-1 sm:w-[160px] bg-ebcont-activvioletdark hover:bg-ebcont-activviolet
        text-white font-semibold px-4 py-2 shadow transition"
          >
            {canvasBg === "black" ? "White Canvas" : "Black Canvas"}
          </button>
          <button
            onClick={handleClusteredLayout}
            className="flex-1 sm:w-[160px] border-2 border-ebcont-activviolet
                    text-ebcont-activviolet 
                    hover:bg-ebcont-activviolet hover:text-white
                      font-semibold px-4 py-2 shadow transition"
          >
            Group
          </button>
          <button
            onClick={handleMixLayout}
            className="flex-1 sm:w-[160px] bg-white
                      border-2 border-ebcont-activviolet
                    text-ebcont-activviolet hover:bg-ebcont-activviolet hover:text-white
                      font-semibold px-4 py-2 shadow transition"
            title="Mix logos randomly (shuffle)"
          >
            Shuffle{" "}
            {/* <span role="img" aria-label="dice">
              🎲
            </span> */}
          </button>
          <button
            onClick={handleReset}
            className="flex-1 sm:w-[160px] border-2 border-ebcont-fuchsia text-ebcont-fuchsia
        bg-white hover:bg-ebcont-fuchsia hover:text-white
        font-semibold px-4 py-2 shadow transition"
          >
            Reset Canvas
          </button>
        </div>
      </div>

      {/* CANVAS */}
      <div
        ref={canvasRef}
        className={`
          relative 
          border-2 border-dashed border-ebcont-turquoise
        hover:border-ebcont-turquoise
          hover:border-2
          rounded overflow-x-auto
          transition
          ${canvasBg === "black" ? "bg-black" : "bg-white"}
        `}
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
          className="canvas-toggle-btn absolute top-4 right-4 border-2 border-ebcont-fuchsia bg-white/60 text-ebcont-darkviolet
           hover:bg-ebcont-fuchsia  hover:text-white font-semibold text-sm px-3 py-1 rounded shadow z-50 transition"
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
                      className="absolute top-1 left-1 w-8 h-8 z-10 accent-ebcont-turquoise cursor-pointer"
                    />
                    <img
                      src={base64}
                      alt={client.name}
                      className={`
                        w-full h-full object-contain 
                        border-2 border-dashed border-ebcont-turquoise
                      hover:border-ebcont-turquoise
                        hover:border-4
                        rounded
                        ${
                          (logoBackgrounds[client.id] ?? "white") === "white"
                            ? "bg-white"
                            : "bg-black"
                        }
                      `}
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

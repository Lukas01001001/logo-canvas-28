// src/components/ClientListModal.tsx

"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// hook and helper to deploy random logo on canvas
import { useCanvasStore } from "@/store/useCanvasStore";
import { useConfirmPlacementDialog } from "@/hooks/useConfirmPlacement";
import { generateClusteredLayout } from "@/utils/clusteredRandomLogoPlacement";
import Spinner from "./ui/Spinner";

//
type Client = {
  id: number;
  name: string;
  industry?: string | null;
  logoBlob?: string | null;
  logoType?: string | null;
};

export function ClientListModal({ onClose }: { onClose: () => void }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("all");
  const [fetching, setFetching] = useState(false);

  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids") || "";
  const initialChecked = idsParam
    .split(",")
    .map((id) => parseInt(id))
    .filter((id) => !isNaN(id));
  const [checked, setChecked] = useState<number[]>(initialChecked);

  const [checkedClientsList, setCheckedClientsList] = useState<Client[]>([]);

  // Get Zustand canvas store state and methods
  const { selectedIds, setCanvas, canvasWidth, canvasHeight } =
    useCanvasStore();
  // Dialog hook for placement confirmation
  const [showPlacementDialog, placementDialog] = useConfirmPlacementDialog();

  // fetching clients
  useEffect(() => {
    if (!checked.length) {
      setCheckedClientsList([]);
      return;
    }
    fetch(`/api/clients/selected?ids=${checked.join(",")}`)
      .then((r) => r.json())
      .then(setCheckedClientsList);
  }, [checked]);

  const MAX_BADGE = 10;
  const checkedClients = checkedClientsList.filter((c) =>
    checked.includes(c.id)
  );
  const extraCount = checkedClients.length - MAX_BADGE;
  const visibleClients = checkedClients.slice(0, MAX_BADGE);

  // Synchronize selection with URL
  useEffect(() => {
    setChecked(initialChecked);
    // eslint-disable-next-line
  }, [idsParam]);

  // Download industries
  useEffect(() => {
    fetch("/api/industries")
      .then((r) => r.json())
      .then((data) => setIndustries(data.map((x: any) => x.name || "")));
  }, []);

  // Get customers (filters)
  const fetchClients = () => {
    setFetching(true);
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (industry && industry !== "all") params.set("industry", industry);
    params.set("limit", "50");
    fetch(`/api/clients?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setClients(data);
        setFetching(false);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line
  }, [name, industry]);

  const handleCheck = (id: number) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const router = useRouter();

  // >>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<
  // Main confirm handler: ask user about layout when clients changed
  const handleConfirm = async () => {
    const oldIds = selectedIds ?? [];
    const newIds = checked;

    // Detect if the list of selected clients has changed
    const idsChanged =
      oldIds.length !== newIds.length ||
      oldIds.some((id) => !newIds.includes(id)) ||
      newIds.some((id) => !oldIds.includes(id));

    let layoutOption: "keep" | "random" = "keep";
    // If there are changes, show the placement dialog and wait for user choice
    if (idsChanged) {
      const choice = await showPlacementDialog(); // "keep", "random", or "cancel"
      if (choice === "cancel") return; // User cancelled
      layoutOption = choice;
    }

    // If user wants randomize, generate new layout and update Zustand
    if (layoutOption === "random") {
      // ustawiamy dla wszystkich logo kolor tła na "white"!
      const logoBackgrounds: Record<number, "black" | "white"> = {};
      newIds.forEach((id) => {
        logoBackgrounds[id] = "white";
      });
      //
      const selectedClients = checkedClientsList.filter((c) =>
        checked.includes(c.id)
      );
      setCanvas({
        layout: generateClusteredLayout(
          selectedClients,
          canvasWidth,
          canvasHeight
        ),
        selectedIds: newIds,
        logoBackgrounds,
      });
    } else {
      // Otherwise, just update the selection in Zustand
      setCanvas({
        selectedIds: newIds,
      });
    }

    // Redirect to /generate with updated ids in URL
    const idsString = checked.join(",");
    const params = new URLSearchParams(searchParams.toString());
    params.set("ids", idsString);
    router.push(`/generate?${params.toString()}`);
    onClose();
  };
  // >>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<

  const clearFilters = () => {
    setName("");
    setIndustry("all");
  };

  const handleSelectAll = () => {
    setChecked((prev) => {
      const visibleIds = clients.map((c) => c.id);
      // Adds only those who are not yet marked
      return Array.from(new Set([...prev, ...visibleIds]));
    });
  };

  const handleResetSelection = () => setChecked([]);

  return (
    <div className="flex flex-col h-[60vh] text-ebcont-darkviolet bg-ebcont-magnolia border-2 border-ebcont-darkmint shadow-2xl shadow-ebcont-darkmint p-6 rounded">
      {/* Filters row */}
      <div className="flex flex-col gap-2 mb-2">
        {/* Search, Industry, Clear filters */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <input
            type="search"
            placeholder="Search by name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full md:w-1/2 border-2 border-ebcont-darkviolet bg-white text-ebcont-darkviolet placeholder-ebcont-darkviolet px-4 py-2 rounded focus:outline-none focus:ring-4 focus:ring-ebcont-activviolet transition font-medium"
          />

          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full md:w-1/4 border-2 border-ebcont-darkviolet bg-white text-ebcont-darkviolet placeholder-ebcont-turquoise px-4 py-2 rounded focus:outline-none focus:ring-4 focus:ring-ebcont-activviolet transition font-medium"
          >
            <option value="all">All industries</option>
            {industries.map((ind) => (
              <option
                key={ind}
                value={ind}
                className="bg-white text-ebcont-darkviolet"
              >
                {ind}
              </option>
            ))}
          </select>
          {/* Push Clear filters to the right */}
          <div className="flex-1 flex justify-end w-full mt-2 md:mt-0">
            <Button
              type="button"
              onClick={clearFilters}
              variant="outline"
              size="lg"
              className="border-2 border-ebcont-fuchsia text-ebcont-fuchsia font-semibold bg-white px-4 py-2 rounded-none text-base transition hover:bg-ebcont-fuchsia hover:text-white focus:outline-none focus:ring-2 focus:ring-ebcont-fuchsia"
            >
              Clear Filters
            </Button>
          </div>
        </div>
        {/* Select/Reset row */}
        <div className="flex gap-2 items-center">
          <Button
            type="button"
            onClick={handleSelectAll}
            variant="outline"
            size="lg"
            className="border-2 border-ebcont-activviolet text-ebcont-activviolet font-semibold bg-white px-4 py-2 rounded-none text-base transition hover:bg-ebcont-activviolet hover:text-white focus:outline-none focus:ring-2 focus:ring-ebcont-activviolet"
          >
            Select All
          </Button>
          <Button
            type="button"
            onClick={handleResetSelection}
            variant="outline"
            size="lg"
            className="border-2 border-ebcont-activviolet text-ebcont-activviolet font-semibold bg-white px-4 py-2 rounded-none text-base transition hover:bg-ebcont-activviolet hover:text-white focus:outline-none focus:ring-2 focus:ring-ebcont-activviolet"
          >
            Reset Selection
          </Button>
          <span
            className="ml-auto text-lg text-ebcont-activvioletdeep"
            aria-live="polite"
            aria-atomic="true"
            aria-label={`Selected clients: ${checked.length}`}
          >
            Selected: <span className="font-bold">{checked.length}</span>
          </span>
        </div>
        {/* Badge row */}
        {checkedClients.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {visibleClients.map((c) => (
              <span
                key={c.id}
                className="bg-ebcont-activvioletdeep text-white text-xs px-2 py-0.5 rounded font-medium"
                aria-label={`Selected client: ${c.name}`}
              >
                {c.name}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="bg-ebcont-activvioletdeep text-white text-xs px-2 py-0.5 rounded font-medium">
                +{extraCount} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* List of clients */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full max-h-full">
          {loading || fetching ? (
            // <div className="text-center py-6">Loading clients…</div>
            <Spinner />
          ) : clients.length === 0 ? (
            <div className="text-center py-6 text-ebcont-darkviolet">
              No clients found.
            </div>
          ) : (
            <ul className="space-y-2 mt-2">
              {clients.map((client) => (
                <li
                  key={client.id}
                  className={`flex items-center gap-4 p-3 border-2 rounded-none bg-white transition-all duration-150 font-semibold
        ${
          checked.includes(client.id)
            ? "border-ebcont-activvioletdeep bg-ebcont-lightmint"
            : "border-ebcont-darkmint"
        }
        hover:bg-ebcont-magnolia`}
                  style={{ minHeight: 64 }}
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={checked.includes(client.id)}
                    onChange={() => handleCheck(client.id)}
                    className="w-6 h-6 accent-ebcont-activvioletdeep cursor-pointer rounded"
                    id={`client-modal-${client.id}`}
                  />
                  {/* LOGO */}
                  {client.logoBlob ? (
                    <img
                      src={`data:${client.logoType};base64,${client.logoBlob}`}
                      alt={client.name}
                      className="w-12 h-12 object-contain rounded bg-white"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-ebcont-mint rounded flex items-center justify-center text-xs text-ebcont-darkmint border-2 border-ebcont-darkmint">
                      <svg
                        width={24}
                        height={24}
                        className="opacity-30 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <rect width="24" height="24" rx="4" fill="#fff" />
                        <path
                          d="M7 16l3-3.86 2.14 2.72L17 12"
                          stroke="#888"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="9" cy="10" r="1" fill="#888" />
                      </svg>
                      No logo
                    </div>
                  )}
                  {/* INFO */}
                  <label
                    htmlFor={`client-modal-${client.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    <span className="font-semibold text-base text-ebcont-darkviolet">
                      {client.name}
                    </span>
                    {client.industry && (
                      <span className="ml-2 text-xs text-ebcont-darkviolet">
                        ({client.industry})
                      </span>
                    )}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </div>
      {/* Footer */}
      <div className="flex justify-end gap-2 mt-4 pt-2 flex-shrink-0 border-t-2 border-ebcont-darkmint bg-ebcont-magnolia">
        <Button
          variant="outline"
          onClick={onClose}
          size="lg"
          className="border-2 border-ebcont-darkviolet text-ebcont-darkviolet font-semibold bg-white px-6 py-2 rounded-none text-base transition hover:bg-ebcont-darkviolet hover:text-white focus:outline-none focus:ring-2 focus:ring-ebcont-darkviolet"
        >
          Cancel
        </Button>
        <Button
          variant="outline"
          onClick={handleConfirm}
          disabled={checked.length === 0}
          size="lg"
          className="border-2 border-ebcont-activviolet text-ebcont-activviolet font-semibold bg-white px-6 py-2 rounded-none text-base transition hover:bg-ebcont-activviolet hover:text-white focus:outline-none focus:ring-2 focus:ring-ebcont-activviolet disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm
        </Button>
      </div>

      {/* // {placementDialog} is the modal component, always rendered in the tree */}
      {placementDialog}
    </div>
  );
}

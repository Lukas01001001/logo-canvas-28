// src/components/ClientList.tsx

"use client";
//*******************************************************************************************/
// This component uses Zustand (a lightweight state manager) to persist selected client IDs
// across navigation. When users select clients via checkboxes, their selections are stored
// in a global store (useClientSelection.ts).
// This allows us to:
// - keep selections when navigating to /clients/[id]/edit, or /clients/new
// - restore checkbox states after returning from those views
// - avoid passing state via the URL (e.g., ?ids=...) after the initial navigation
//*******************************************************************************************/

import { Suspense } from "react";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Spinner from "./ui/Spinner";
import ClientCard from "./ClientCard";
import EmptyState from "./ui/EmptyState";
import ClientListHeader from "./ClientListHeader";
import { useClientSelection } from "@/store/useClientSelection";
import { useCanvasStore } from "@/store/useCanvasStore";

type Client = {
  id: number;
  name: string;
  address?: string | null;
  industry?: string | null;
  logoBlob?: Uint8Array | null;
  logoType?: string | null;
};

const LIMIT = 20;

export default function ClientList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const selectedClients = useClientSelection((s) => s.selectedClients);
  const toggleClient = useClientSelection((s) => s.toggleClient);
  //
  const resetSelection = useClientSelection((s) => s.resetSelection);
  const resetCanvas = useCanvasStore((s) => s.resetCanvas);

  const handleReset = () => {
    resetSelection(); // cleans up selections
    resetCanvas([]); // clears canvas to empty (no logo = empty layout)
  };

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    const name = searchParams.get("name");
    const industry = searchParams.get("industry");
    if (name) params.set("name", name);
    if (industry) params.set("industry", industry);
    return params.toString();
  }, [searchParams]);

  // Reset of customer list when changing filters
  useEffect(() => {
    setClients([]);
    setPage(0);
    setHasMore(true);
  }, [searchParams.get("name"), searchParams.get("industry")]);

  // Downloading customers
  useEffect(() => {
    const controller = new AbortController();

    const fetchClients = async () => {
      if (loading || (!hasMore && page > 0)) return;

      try {
        setLoading(true);
        const params = new URLSearchParams(queryString);
        params.set("skip", String(page * LIMIT));
        params.set("limit", String(LIMIT));

        const res = await fetch(`/api/clients?${params.toString()}`, {
          signal: controller.signal,
        });

        const data: Client[] = await res.json();

        setClients((prev) => {
          const ids = new Set(prev.map((c) => c.id));
          const newClients = data.filter((c) => !ids.has(c.id));
          return page === 0 ? newClients : [...prev, ...newClients];
        });

        if (data.length < LIMIT) {
          setHasMore(false);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("❌ Fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
    return () => controller.abort();
  }, [page, queryString]);

  // Infinite scroll
  const lastClientRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleGenerate = () => {
    if (selectedClients.length > 0) {
      const query = new URLSearchParams();
      query.set("ids", selectedClients.join(","));

      const name = searchParams.get("name");
      const industry = searchParams.get("industry");
      if (name) query.set("name", name);
      if (industry) query.set("industry", industry);

      router.push(`/generate?${query.toString()}`);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <ClientListHeader
          selectedCount={selectedClients.length}
          onReset={handleReset}
          onGenerate={handleGenerate}
          layout={layout}
          onToggleLayout={() =>
            setLayout((prev) => (prev === "grid" ? "list" : "grid"))
          }
        />

        <div
          className={`grid gap-6 ${
            layout === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {clients.map((client, index) => {
            const isLast = index === clients.length - 1;
            return (
              <div key={client.id} ref={isLast ? lastClientRef : null}>
                <ClientCard
                  id={client.id}
                  name={client.name}
                  industry={client.industry}
                  logoBlob={client.logoBlob}
                  logoType={client.logoType}
                  selected={selectedClients.includes(client.id)}
                  toggle={() => toggleClient(client.id)}
                  queryString={queryString}
                  selectedIds={selectedClients}
                />
              </div>
            );
          })}
        </div>

        {!loading && clients.length === 0 && (
          <EmptyState message="No clients found matching the selected filters." />
        )}

        {loading && (
          <div className="flex justify-center my-6">
            <Spinner />
          </div>
        )}
      </div>
    </Suspense>
  );
}

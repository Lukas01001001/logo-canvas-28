// src/components/ClientListModal.tsx

"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const handleConfirm = () => {
    const idsString = checked.join(",");
    const params = new URLSearchParams(searchParams.toString());
    params.set("ids", idsString);
    router.push(`/generate?${params.toString()}`);
    onClose();
  };

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
    <div className="flex flex-col h-[60vh]">
      {/* Filters row */}
      <div className="flex flex-col gap-2 mb-2">
        {/* Search, Industry, Clear filters */}
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <Input
            type="search"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Search by name"
            className="bg-[#171b22] border-border text-base md:max-w-xs"
          />
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="bg-[#171b22] border-border text-base w-full md:max-w-xs">
              <SelectValue placeholder="All industries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All industries</SelectItem>
              {industries.map((i) => (
                <SelectItem value={i} key={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Push Clear filters to the right */}
          <div className="flex-1 flex justify-end w-full mt-2 md:mt-0">
            <Button
              type="button"
              onClick={clearFilters}
              variant="outline"
              size="sm"
              className="text-xs border border-gray-600"
            >
              Clear filters
            </Button>
          </div>
        </div>
        {/* Select/Reset row */}
        <div className="flex gap-2 items-center">
          <Button
            type="button"
            onClick={handleSelectAll}
            variant="outline"
            size="sm"
            className="text-xs border border-gray-600"
          >
            Select all
          </Button>
          <Button
            type="button"
            onClick={handleResetSelection}
            variant="outline"
            size="sm"
            className="text-xs border border-gray-600"
          >
            Reset selection
          </Button>
          <span
            className="ml-auto text-xs text-gray-400"
            aria-live="polite"
            aria-atomic="true"
            aria-label={`Selected clients: ${checked.length}`}
          >
            Selected {checked.length}
          </span>
        </div>
        {/* Badge row */}
        {checkedClients.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {visibleClients.map((c) => (
              <span
                key={c.id}
                className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded font-medium"
                aria-label={`Selected client: ${c.name}`}
              >
                {c.name}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="bg-blue-700 text-white text-xs px-2 py-0.5 rounded font-medium">
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
            <div className="text-center py-6">Loading clients…</div>
          ) : clients.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              No clients found.
            </div>
          ) : (
            <ul className="space-y-2 mt-2">
              {clients.map((client) => (
                <li
                  key={client.id}
                  className={`flex items-center gap-4 p-3 rounded-xl bg-[#202432] border transition-all duration-150
        ${
          checked.includes(client.id)
            ? "border-blue-500 ring-2 ring-blue-800 shadow"
            : "border-transparent"
        }
        hover:border-blue-400`}
                  style={{ minHeight: 64 }}
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={checked.includes(client.id)}
                    onChange={() => handleCheck(client.id)}
                    className="w-6 h-6 accent-blue-500 cursor-pointer"
                    id={`client-modal-${client.id}`}
                  />
                  {/* LOGO */}
                  {client.logoBlob ? (
                    <img
                      src={`data:${client.logoType};base64,${client.logoBlob}`}
                      alt={client.name}
                      className="w-12 h-12 object-contain rounded bg-white border"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400 border">
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
                    <span className="font-semibold text-base text-white">
                      {client.name}
                    </span>
                    {client.industry && (
                      <span className="ml-2 text-xs text-gray-400">
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
      <div className="flex justify-end gap-2 mt-4 pt-2 flex-shrink-0 border-t border-border bg-background">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="outline"
          onClick={handleConfirm}
          disabled={checked.length === 0}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}

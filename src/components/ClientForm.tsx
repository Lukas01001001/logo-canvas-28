// src/components/ClientForm.tsx

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";

type Industry = {
  id: number;
  name: string;
};

type Client = {
  id?: number;
  name: string;
  address?: string | null;
  industry?: { name: string } | null;
  logoBlob?: Uint8Array | null;
  logoType?: string | null;
};

type Props = {
  client?: Client;
  isEdit?: boolean;
  onSuccess?: () => void;
  availableIndustries?: Industry[];
};

export default function ClientForm({
  client,
  isEdit = false,
  onSuccess,
  availableIndustries = [],
}: Props) {
  const [name, setName] = useState(client?.name || "");
  const [address, setAddress] = useState(client?.address || "");
  const [industryName, setIndustryName] = useState(
    client?.industry?.name || ""
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim().length < 2) {
      alert("Name must be at least 2 characters.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("industry", industryName); // New or existing
    if (logoFile) formData.append("logo", logoFile);

    const endpoint =
      isEdit && client?.id ? `/api/clients/${client.id}` : "/api/clients";

    const res = await fetch(endpoint, {
      method: isEdit ? "PUT" : "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      showToast(
        data.message || (isEdit ? "Client updated." : "Client saved."),
        "success"
      );
      router.push("/clients");
      if (onSuccess) onSuccess();
    } else {
      showToast(data.error || "Error saving client.", "error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-gray-900 shadow-md rounded-lg space-y-4 text-white"
    >
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">
          Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">
          Industry (choose or type new)
        </label>
        <input
          list="industry-options"
          autoComplete="off"
          value={industryName}
          onChange={(e) => setIndustryName(e.target.value)}
          required
          className="w-full bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <datalist id="industry-options">
          {availableIndustries.map((ind) => (
            <option key={ind.id} value={ind.name} />
          ))}
        </datalist>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">
          Logo (click or drag & drop)
        </label>

        <label
          htmlFor="logo-upload"
          className="relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-800 hover:border-blue-500 transition"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) setLogoFile(file);
          }}
        >
          {logoFile ? (
            <>
              <img
                src={URL.createObjectURL(logoFile)}
                alt="New preview"
                className="max-h-28 object-contain mb-2"
              />
              <p className="text-sm text-gray-300">{logoFile.name}</p>
            </>
          ) : client?.id && client?.logoBlob && client?.logoType ? (
            <>
              <img
                src={`data:${client.logoType};base64,${Buffer.from(
                  client.logoBlob
                ).toString("base64")}`}
                alt="Current logo"
                className="max-h-28 object-contain mb-2"
              />
              <p className="text-sm text-gray-400 italic">Current logo</p>
            </>
          ) : (
            <span className="text-gray-400">Click or drag an image here</span>
          )}

          <input
            id="logo-upload"
            type="file"
            accept=".svg,.png,.jpg,.jpeg"
            onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </label>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow"
        >
          {isEdit ? "Update client" : "Save client"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/clients")}
          className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded shadow"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

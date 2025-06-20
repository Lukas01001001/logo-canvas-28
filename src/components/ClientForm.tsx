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
      className="max-w-2xl mx-auto p-8 bg-ebcont-magnolia border-2 border-ebcont-darkviolet shadow-2xl shadow-ebcont-darkviolet rounded space-y-6 text-ebcont-darkviolet"
    >
      <h2 className="text-2xl text-ebcont-darkviolet font-bold text-center mb-2">
        {isEdit ? "Edit Client" : "Add New Client"}
      </h2>

      {/* Name */}
      <div>
        <label className="block text-base font-semibold mb-1 text-ebcont-darkviolet">
          Name<span className="text-ebcont-fuchsia ml-1">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="
        w-full bg-white text-ebcont-darkviolet border border-ebcont-darkviolet
        rounded-none px-4 py-2 font-medium
        focus:outline-none focus:ring-2 focus:ring-ebcont-activviolet
        placeholder-ebcont-activviolet/80
        transition
      "
          placeholder="Enter client name"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-base font-semibold mb-1 text-ebcont-darkviolet">
          Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="
        w-full bg-white text-ebcont-darkviolet border border-ebcont-darkviolet
        rounded-none px-4 py-2 font-medium
        focus:outline-none focus:ring-2 focus:ring-ebcont-activviolet
        placeholder-ebcont-activviolet/80
        transition
      "
          placeholder="Enter address"
        />
      </div>

      {/* Industry */}
      <div>
        <label className="block text-base font-semibold mb-1 text-ebcont-darkviolet">
          Industry (choose)
        </label>
        <select
          value={industryName}
          onChange={(e) => setIndustryName(e.target.value)}
          required
          className="
        w-full bg-white text-ebcont-darkviolet border border-ebcont-darkviolet
        rounded-none px-4 py-2 font-medium
        focus:outline-none focus:ring-2 focus:ring-ebcont-activviolet
        transition
        placeholder-ebcont-activviolet/80
      "
        >
          <option value="" disabled>
            {availableIndustries.length === 0
              ? "No industries. Add one first!"
              : "Choose industry..."}
          </option>
          {availableIndustries.map((ind) => (
            <option key={ind.id} value={ind.name}>
              {ind.name}
            </option>
          ))}
        </select>
      </div>

      {/* Logo upload */}
      <div>
        <label className="block text-base font-semibold mb-1 text-ebcont-darkviolet">
          Logo (click or drag & drop)
        </label>
        <label
          htmlFor="logo-upload"
          className="
        relative flex flex-col items-center justify-center w-full h-44
        border-2 border-dashed border-ebcont-activviolet
        rounded-xl cursor-pointer bg-white hover:border-ebcont-activviolet hover:border-4 transition
      "
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
              <p className="text-sm text-ebcont-activviolet">{logoFile.name}</p>
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
              <p className="text-sm text-ebcont-darkviolet italic">
                Current logo
              </p>
            </>
          ) : (
            <span className="text-ebcont-activviolet">
              Click or drag an image here
            </span>
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

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
        <button
          type="submit"
          className="
        w-full sm:w-auto
        border-2 border-ebcont-activviolet
        bg-ebcont-activviolet hover:bg-ebcont-fuchsia hover:border-ebcont-fuchsia
        text-white font-semibold px-6 py-2
        shadow transition
      "
        >
          {isEdit ? "Update client" : "Save client"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/clients")}
          className="
        w-full sm:w-auto
        border-2 border-ebcont-activviolet text-ebcont-activviolet bg-white hover:bg-ebcont-activviolet hover:text-white
        font-semibold px-6 py-2
        shadow transition
      "
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

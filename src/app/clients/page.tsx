// src/app/clients/page.tsx

import { Suspense } from "react";
import ClientFilters from "@/components/ClientFilters";
import ClientList from "@/components/ClientList";
import { prisma } from "@/lib/db";

import Link from "next/link";
import Spinner from "@/components/ui/Spinner";

export const dynamic = "force-dynamic";

// SSR - industry
export default async function ClientsPage() {
  const industries: { name: string }[] = await prisma.industry.findMany();

  return (
    <Suspense
      fallback={
        <div className="flex justify-center my-6">
          <Spinner />
        </div>
      }
    >
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex flex-col md:flex-row md:items-center w-full gap-4">
            <ClientFilters
              availableIndustries={industries.map((i) => i.name)}
            />
          </div>
          {/* BUTTON NEW INDUSTRY */}
          <Link
            href="/industries"
            className="
    bg-ebcont-activviolet
    hover:bg-ebcont-fuchsia
    text-white
    font-semibold
    px-6 py-2
    shadow-md
    whitespace-nowrap
    text-center
    "
          >
            Add Industry
          </Link>

          {/* BUTTON NEW CLIENT */}
          <Link
            href="/clients/new"
            className="
    bg-ebcont-activviolet
    hover:bg-ebcont-fuchsia
    text-white
    font-semibold
    px-6 py-2
    shadow-md
    whitespace-nowrap
    text-center
  "
          >
            Add New Client
          </Link>
        </div>

        {/* CLIENT LIST */}
        <ClientList />
      </div>
    </Suspense>
  );
}

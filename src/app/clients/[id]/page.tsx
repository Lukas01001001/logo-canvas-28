// src/app/clients/[id]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import DeleteButton from "@/components/DeleteButton";
import BackToListButton from "@/components/BackToListButton";
import { MapPin, Building2 } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id: parseInt(id) },
    include: { industry: true },
  });

  if (!client) return notFound();

  const base64Logo =
    client.logoBlob && client.logoType
      ? `data:${client.logoType};base64,${Buffer.from(client.logoBlob).toString(
          "base64"
        )}`
      : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-gradient-to-br from-gray-800/90 via-gray-900/95 to-blue-900/80 p-8 rounded-3xl shadow-xl border border-gray-700/60 backdrop-blur-sm transition-all">
        <h1 className="text-3xl sm:text-4xl font-bold mb-7 text-center text-white tracking-tight drop-shadow-lg">
          {client.name}
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-60 h-60 min-w-[180px] flex items-center justify-center bg-white/90 rounded-2xl shadow-lg border border-gray-300 hover:scale-105 hover:shadow-xl transition-all duration-300">
            {base64Logo ? (
              <img
                src={base64Logo}
                alt={`${client.name} logo`}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <span className="text-gray-400">No Logo</span>
            )}
          </div>
          <div className="flex-1 w-full text-white space-y-4 text-base">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-purple-100" />
              <span className="font-semibold">Address:</span>
              <span className="ml-1 text-gray-200">
                {client.address || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-purple-100" />
              <span className="font-semibold">Industry:</span>
              <span className="ml-1 text-gray-200">
                {client.industry?.name || "N/A"}
              </span>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-700/60" />

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <BackToListButton />
          <Link
            href={`/clients/${client.id}/edit`}
            className="bg-yellow-500 hover:bg-yellow-600 font-semibold text-white px-6 py-2 rounded-md shadow transition-all text-center"
          >
            Edit
          </Link>
          <DeleteButton id={client.id} name={client.name} />
        </div>
      </div>
    </div>
  );
}

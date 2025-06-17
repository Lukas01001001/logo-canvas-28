// src/app/clients/[id]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import DeleteButton from "@/components/DeleteButton";
import BackToListButton from "@/components/BackToListButton";
import { MapPin, Building2 } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ClientDetailPage({ params }: Props) {
  // get session
  const session = await getServerSession(authOptions);

  const { id } = await params;

  // Get the client together with the userId!
  const client = await prisma.client.findUnique({
    where: { id: Number(id) },
    //include: { industry: true, user: true },
    include: { industry: true },
  });

  // If there is no client OR does not belong to a user, 404
  if (
    !client ||
    !session?.user?.id ||
    client.userId !== Number(session.user.id)
  ) {
    return notFound();
  }

  const base64Logo =
    client.logoBlob && client.logoType
      ? `data:${client.logoType};base64,${Buffer.from(client.logoBlob).toString(
          "base64"
        )}`
      : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-ebcont-magnolia p-8 rounded-none shadow-2xl shadow-ebcont-darkmint  border-2 border-ebcont-turquoise transition-all">
        <h1 className="text-3xl sm:text-4xl font-bold mb-7 text-center text-ebcont-darkviolet tracking-tight drop-shadow-sm">
          {client.name}
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="p-2 w-60 h-60 min-w-[180px] flex items-center shadow-ebcont-darkmint justify-center bg-white rounded-none shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300">
            {base64Logo ? (
              <img
                src={base64Logo}
                alt={`${client.name} logo`}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <span className="text-ebcont-turquoise font-semibold">
                No Logo
              </span>
            )}
          </div>
          <div className="flex-1 w-full text-ebcont-darkviolet space-y-6 text-base">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-ebcont-activviolet" />
              <span className="font-semibold">Address:</span>
              <span className="ml-1 text-ebcont-darkviolet opacity-80">
                {client.address || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-ebcont-activviolet" />
              <span className="font-semibold">Industry:</span>
              <span className="ml-1 text-ebcont-darkviolet opacity-80">
                {client.industry?.name || "N/A"}
              </span>
            </div>
          </div>
        </div>
        <hr className="my-6 border border-ebcont-turquoise" />

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <BackToListButton />
          <Link
            href={`/clients/${client.id}/edit`}
            className="min-w-[120px] bg-ebcont-activviolet hover:bg-ebcont-fuchsia font-semibold text-white px-6 py-2 shadow transition-all text-center"
          >
            Edit
          </Link>
          <DeleteButton id={client.id} name={client.name} />
        </div>
      </div>
    </div>
  );
}

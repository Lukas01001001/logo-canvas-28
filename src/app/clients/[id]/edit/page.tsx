// src/app/clients/[id]/edit/page.tsx

import { prisma } from "@/lib/db";
import ClientForm from "@/components/ClientForm";
import { redirect } from "next/navigation";

export default async function EditClientPage(props: {
  params: Promise<{ id: string }>;
}) {
  const industries = await prisma.industry.findMany({
    orderBy: { name: "asc" },
  });
  const { id } = await props.params;

  const client = await prisma.client.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      address: true,
      logoBlob: true,
      logoType: true,
      industry: { select: { name: true } },
    },
  });

  if (!client) {
    redirect("/clients");
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">
        Edit Client
      </h1>
      <ClientForm client={client} isEdit availableIndustries={industries} />
    </div>
  );
}

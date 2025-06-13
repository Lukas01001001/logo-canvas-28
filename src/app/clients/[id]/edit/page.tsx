// src/app/clients/[id]/edit/page.tsx

import { prisma } from "@/lib/db";
import ClientForm from "@/components/ClientForm";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function EditClientPage(props: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

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
      userId: true,
      industry: { select: { name: true } },
    },
  });

  if (
    !client ||
    !session?.user?.id ||
    client.userId !== Number(session.user.id)
  ) {
    redirect("/clients");
  }

  return (
    <div className="p-12">
      <ClientForm client={client} isEdit availableIndustries={industries} />
    </div>
  );
}

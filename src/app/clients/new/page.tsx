// src/app/clients/new/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ClientForm from "@/components/ClientForm";
import { prisma } from "@/lib/db";

export default async function NewClientPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    //
    redirect("/");
  }
  const industries = await prisma.industry.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-12">
      <ClientForm availableIndustries={industries} />
    </div>
  );
}

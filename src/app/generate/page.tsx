// src/app/generate/page.tsx

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import LogoCanvas from "@/components/LogoCanvas";

import DownloadButton from "@/components/DownloadButton";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { AddClientsButton } from "@/components/AddClientsButton";

//******* There may be a need to give up 'Promise' when the project is hosted on a server.  ********/
// 🟦 ALTERNATIVE - version according to Next.js documentation:
//------------------------------------------------------
// type Props = {
//   searchParams: { ids?: string; name?: string; industry?: string };
// };
//******** ******** ******** ********* ******** ******** *********/
type Props = {
  searchParams: Promise<{ ids?: string; name?: string; industry?: string }>;
};
//******* There may be a need to give up 'Promise' when the project is hosted on a server.  ********/
// 🟦 ALTERNATIVE - version according to Next.js documentation:
//------------------------------------------------------
// export default async function GeneratePage({ searchParams }: Props) {
//   const { ids, name, industry } = searchParams;
//******** ******** ******** ********* ******** ******** *********/
export default async function GeneratePage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/");
  }
  const userId = Number(session.user.id);

  const { ids, name, industry } = await searchParams;

  if (!ids || !ids.match(/^\d+(,\d+)*$/)) return notFound();

  const params = new URLSearchParams();
  params.set("ids", ids);
  if (name) params.set("name", name);
  if (industry) params.set("industry", industry);

  const idList = ids.split(",").map((id) => parseInt(id.trim()));

  const rawClients = await prisma.client.findMany({
    where: { id: { in: idList }, userId: userId },
  });

  const clients = rawClients.map((client) => ({
    ...client,
    logoBlob: client.logoBlob
      ? Buffer.from(client.logoBlob).toString("base64")
      : null,
  }));

  if (!clients.length) return notFound();

  return (
    <div className="p-8">
      {/* Top navigation with title and buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        {/* Logo/title center */}
        <h1 className="text-2xl sm:text-3xl font-bold text-ebcont-darkviolet text-center flex-1 drop-shadow-sm">
          Canvas
        </h1>
        {/* Buttons right */}
        <div className="flex gap-4 items-center justify-end w-full sm:w-auto">
          <AddClientsButton />
          <DownloadButton />
        </div>
      </div>

      {/* Canvas with logos */}
      <LogoCanvas clients={clients} />
    </div>
  );
}

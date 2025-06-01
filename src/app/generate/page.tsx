// src/app/generate/page.tsx

//*******************************************************************************************/
// This page does NOT use Zustand for client selection.
// Instead, it reads selected client IDs directly from the URL (searchParams.ids).
// Why?
// ✅ This is a server component (async function), so we cannot use client-side Zustand here.
// ✅ The `ids` are passed explicitly via URL when navigating from /clients to /generate.
// ✅ This ensures full compatibility with server rendering and direct links/bookmarks.
// When the user clicks "← Back to List", the URL also contains filters and `ids`,
// allowing the client list to restore checkboxes and filters properly.
//*******************************************************************************************/
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import LogoCanvas from "@/components/LogoCanvas";

import DownloadButton from "@/components/DownloadButton";
import Link from "next/link";

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
  const { ids, name, industry } = await searchParams;

  if (!ids || !ids.match(/^\d+(,\d+)*$/)) return notFound();

  const params = new URLSearchParams();
  params.set("ids", ids);
  if (name) params.set("name", name);
  if (industry) params.set("industry", industry);

  const idList = ids.split(",").map((id) => parseInt(id.trim()));
  const rawClients = await prisma.client.findMany({
    where: { id: { in: idList } },
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
        {/* Back button */}
        <Link
          href={`/clients?${params.toString()}`}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow text-center"
        >
          ← Back to List
        </Link>

        {/* Title in the middle */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center flex-1">
          Logo Forest
        </h1>

        {/* Download button */}
        <DownloadButton />
      </div>

      {/* Canvas with logos */}
      <LogoCanvas clients={clients} />
    </div>
  );
}

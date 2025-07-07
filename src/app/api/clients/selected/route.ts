// src/app/api/clients/selected/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = Number(session.user.id);
  const { searchParams } = new URL(req.url);
  const ids = (searchParams.get("ids") || "")
    .split(",")
    .map((id) => parseInt(id))
    .filter((id) => !isNaN(id));

  if (!ids.length) {
    return NextResponse.json([]);
  }

  const clients = await prisma.client.findMany({
    where: {
      id: { in: ids },
      userId,
    },
    include: { industry: true },
  });

  return NextResponse.json(
    clients.map((c) => ({
      id: c.id,
      name: c.name,
      industry: c.industry?.name || null,
      logoBlob: c.logoBlob ? Buffer.from(c.logoBlob).toString("base64") : null,
      logoType: c.logoType || null,
    }))
  );
}

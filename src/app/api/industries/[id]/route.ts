// src/app/api/industries/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { NextRequest } from "next/server";

// PUT edit
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name || name.trim().length < 2) {
    return NextResponse.json(
      { error: "Industry name is too short." },
      { status: 400 }
    );
  }

  const url = new URL(req.url);
  const id = parseInt(url.pathname.split("/").pop() || "", 10);

  const industry = await prisma.industry.update({
    where: { id },
    data: { name: name.trim() },
  });

  return NextResponse.json(industry);
}

// DELETE
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const id = parseInt(url.pathname.split("/").pop() || "", 10);

  const industry = await prisma.industry.findUnique({
    where: { id },
    include: { clients: true },
  });

  if (!industry)
    return NextResponse.json({ error: "Industry not found." }, { status: 404 });

  if (industry.clients.length > 0) {
    return NextResponse.json(
      { error: "Cannot delete industry with assigned clients." },
      { status: 400 }
    );
  }

  await prisma.industry.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

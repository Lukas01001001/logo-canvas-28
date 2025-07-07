// src/app/api/industries/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all industries
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const industries = await prisma.industry.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { clients: true } },
    },
  });
  return NextResponse.json(industries);
}

// POST new industry
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name || name.trim().length < 2) {
    return NextResponse.json(
      { error: "Name must be at least 2 characters." },
      { status: 400 }
    );
  }

  // Check uniqueness
  const existing = await prisma.industry.findFirst({
    where: { name: { equals: name.trim(), mode: "insensitive" } },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Industry already exists." },
      { status: 400 }
    );
  }

  const industry = await prisma.industry.create({
    data: { name: name.trim() },
  });
  return NextResponse.json(industry, { status: 201 });
}

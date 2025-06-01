// src/app/api/clients/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { promises as fs } from "fs";
import path from "path";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("name")?.toLowerCase() || "";

  const industry = searchParams.get("industry") || "";

  const skip = parseInt(searchParams.get("skip") || "0");

  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const clients = await prisma.client.findMany({
    where: {
      AND: [
        name
          ? {
              name: {
                contains: name,
                mode: "insensitive",
              },
            }
          : {},
        industry
          ? {
              industry: {
                name: {
                  equals: industry,
                  mode: "insensitive",
                },
              },
            }
          : {},
      ],
    },
    include: {
      industry: true,
    },
    orderBy: { name: "asc" },
    skip,
    take: limit,
  });

  // DEBUG ↓↓↓
  //console.log("🔍 Query name:", name);
  //console.log("🔍 Query industry:", industry);
  //console.log(
  //  "📦 Found clients:",
  //  clients.map((c) => c.name)
  //);

  //return NextResponse.json(clients);
  return NextResponse.json(
    clients.map((c) => ({
      ...c,
      industry: c.industry?.name || null,
    }))
  );
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name")?.toString().trim();

    const address = formData.get("address") as string;

    const industryName = (formData.get("industry") as string)?.trim();

    if (!industryName) {
      return NextResponse.json(
        { error: "Industry is required." },
        { status: 400 }
      );
    }

    let industry = await prisma.industry.findFirst({
      where: { name: { equals: industryName, mode: "insensitive" } },
    });

    if (!industry) {
      industry = await prisma.industry.create({
        data: { name: industryName },
      });
    }
    const file = formData.get("logo") as File | null;

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters." },
        { status: 400 }
      );
    }

    let buffer: Buffer;
    let type: string;

    if (file && !file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed." },
        { status: 400 }
      );
    }

    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      type = file.type;
    } else {
      // use default logo
      const defaultPath = path.join(process.cwd(), "public/Tux_Default.png");
      buffer = await fs.readFile(defaultPath);
      type = "image/png";
    }

    const client = await prisma.client.create({
      data: {
        name,
        address,
        logoBlob: buffer,
        logoType: type,
        industry: { connect: { id: industry.id } },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Client saved successfully.",
      client,
    });
  } catch (error) {
    console.error("Error saving client:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

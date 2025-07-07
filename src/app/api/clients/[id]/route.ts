// src/app/api/clients/[id]/route.ts

import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function PUT(req: Request, { params }: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = Number(session.user.id);

    const clientId = parseInt(params.id);
    if (isNaN(clientId)) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
    }

    // Check if the customer belongs to the user!
    const existing = await prisma.client.findUnique({
      where: { id: clientId },
      select: { userId: true },
    });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const name = formData.get("name")?.toString().trim();
    const address = formData.get("address")?.toString().trim();
    const industryName = formData.get("industry")?.toString().trim();
    const file = formData.get("logo") as File | null;

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters." },
        { status: 400 }
      );
    }
    if (!industryName) {
      return NextResponse.json(
        { error: "Industry name is required." },
        { status: 400 }
      );
    }

    let industry = await prisma.industry.findFirst({
      where: { name: { equals: industryName, mode: "insensitive" } },
    });
    if (!industry) {
      industry = await prisma.industry.create({ data: { name: industryName } });
    }

    // Prepare data for update
    const updateData: Prisma.ClientUpdateInput = {
      name,
      address,
      industry: { connect: { id: industry.id } },
    };

    if (file && file.size > 0 && file.type.startsWith("image/")) {
      const arrayBuffer = await file.arrayBuffer();
      updateData.logoBlob = Buffer.from(arrayBuffer);
      updateData.logoType = file.type;
    }

    const updated = await prisma.client.update({
      where: { id: clientId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Client updated successfully.",
      updated,
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    const clientId = parseInt(params.id);
    if (isNaN(clientId)) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
    }
    // 1. Get the customer's industry before deleting
    // and Check if the customer belongs to the user!!!
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { industryId: true, userId: true },
    });

    if (!client || client.userId !== userId) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    // 2. Remove customer
    await prisma.client.delete({
      where: { id: clientId },
    });

    // // 3. Check the industry for other customers
    // if (client.industryId) {
    //   const clientsInIndustry = await prisma.client.count({
    //     where: { industryId: client.industryId },
    //   });

    //   // 4. If there is none - remove the branch
    //   if (clientsInIndustry === 0) {
    //     await prisma.industry.delete({
    //       where: { id: client.industryId },
    //     });
    //   }
    // }

    return NextResponse.json({
      success: true,
      message: "Client deleted successfully.",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete client." },
      { status: 500 }
    );
  }
}

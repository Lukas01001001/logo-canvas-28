// src/app/api/clients/[id]/route.ts

import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

// export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {

// export async function PUT(
//   req: Request,
//   { params }: { params: Record<string, string> }
// ) {
// params.id

//export async function PUT(req: Request, { params }) {
// params.id
export const runtime = "nodejs";

export async function PUT(req: Request, { params }: any) {
  try {
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
      // validation industry name
      return NextResponse.json(
        { error: "Industry name is required." },
        { status: 400 }
      );
    }

    // find or create an industry
    let industry = await prisma.industry.findFirst({
      where: { name: { equals: industryName, mode: "insensitive" } },
    });

    if (!industry) {
      industry = await prisma.industry.create({
        data: { name: industryName },
      });
    }

    const updateData: Prisma.ClientUpdateInput = {
      name,
      address,
      industry: { connect: { id: industry.id } },
      ...(file && file.size > 0
        ? {
            logoBlob: Buffer.from(await file.arrayBuffer()),
            logoType: file.type,
          }
        : {}),
    };

    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      updateData.logoBlob = buffer;
      updateData.logoType = file.type;
    }

    const updated = await prisma.client.update({
      where: { id: parseInt(params.id) },
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

// export async function DELETE(
//   _: Request,
//   { params }: { params: { id: string } }
// ) {

// export async function DELETE(
//   req: Request,
//   { params }: { params: Record<string, string> }
// ) {
// params.id

// export async function DELETE(req: Request, { params }) {

export async function DELETE(req: Request, { params }: any) {
  try {
    const clientId = parseInt(params.id);

    // 1. Get the customer's industry before deleting
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { industryId: true },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found." }, { status: 404 });
    }

    // 2. Remove customer
    await prisma.client.delete({
      where: { id: clientId },
    });

    // 3. Check the industry for other customers
    if (client.industryId) {
      const clientsInIndustry = await prisma.client.count({
        where: { industryId: client.industryId },
      });

      // 4. If there is none - remove the branch
      if (clientsInIndustry === 0) {
        await prisma.industry.delete({
          where: { id: client.industryId },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Client (and possibly orphaned industry) deleted successfully.",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete client." },
      { status: 500 }
    );
  }
}

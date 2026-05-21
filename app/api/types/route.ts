import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const types = await prisma.type.findMany({
      include: {
        category: true,
        specs: true,
        products: true,
      },
    });
    return NextResponse.json(types);
  } catch (error) {
    console.error("Error fetching types:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, categoryID } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Name is required and must be a non-empty string" },
        { status: 400 },
      );
    }

    if (!categoryID || typeof categoryID !== "number" || categoryID <= 0) {
      return NextResponse.json(
        { error: "Valid categoryID is required" },
        { status: 400 },
      );
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryID },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    const type = await prisma.type.create({
      data: {
        name: name.trim(),
        categoryID,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(type, { status: 201 });
  } catch (error) {
    console.error("Error creating type:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Type name must be unique" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

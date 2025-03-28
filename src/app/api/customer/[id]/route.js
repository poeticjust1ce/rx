import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req, { params }) {
  const { id } = await params;

  try {
    const customer = await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json({ customer }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ customer }, { status: 400 });
  }
}

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  const res = await request.json();

  const { name, location } = res;

  console.log({ res });

  const result = await prisma.customer.create({
    data: {
      name,
      location,
    },
  });

  return NextResponse.json({ result });
}

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  console.log("API HIT ⭐");

  const res = await request.json();

  const { name, email, password } = res;

  const hashed = await bcrypt.hash(password, 12);

  const exists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (exists) {
    return NextResponse.json(
      { message: "Email already exists" },
      { status: 400 }
    );
  }
  console.log({ res });

  try {
    const result = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashed,
      },
    });

    await prisma.activity.create({
      data: {
        type: "User",
        message: `New user ${name} registered`,
      },
    });

    return NextResponse.json(
      { message: "Account created successfully." },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 400 });
  }
}

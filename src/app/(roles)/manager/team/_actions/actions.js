// src/app/(roles)/manager/my-team/_actions/actions.js
"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Get current manager's team
export async function getMyTeam() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  return await prisma.user.findMany({
    where: {
      managerId: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActivated: true,
    },
  });
}

export async function getAvailableUsers() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  return await prisma.user.findMany({
    where: {
      managerId: null,
      id: { not: session.user.id },
      role: "user",
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}

export async function assignToTeam(userId) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  return await prisma.user.update({
    where: { id: userId },
    data: {
      managerId: session.user.id,
      isActivated: true,
    },
  });
}

export async function addTeamMember(formData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const { name, email, role, password } = Object.fromEntries(formData);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: {
      name,
      email,
      role,
      password: hashedPassword,
      managerId: session.user.id,
      isActivated: true,
    },
  });
}

export async function updateTeamMember(formData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const { id, name, role } = Object.fromEntries(formData);

  const existingUser = await prisma.user.findFirst({
    where: {
      id,
      managerId: session.user.id,
    },
  });

  if (!existingUser) {
    throw new Error("User not found in your team");
  }

  return await prisma.user.update({
    where: { id },
    data: {
      name,
      role,
      updatedAt: new Date(),
    },
  });
}

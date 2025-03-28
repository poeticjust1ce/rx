"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for user creation
const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["admin", "manager", "user"]),
});

export async function createUser(formData) {
  try {
    const validatedData = createUserSchema.parse(formData);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const user = await prisma.user.create({
      data: {
        ...validatedData,
        isActivated: true, // Activate by default
      },
    });

    revalidatePath("/admin/users");
    return user;
  } catch (error) {
    throw error;
  }
}

export async function deleteUser(id) {
  try {
    await prisma.inventoryItem.deleteMany({
      where: {
        inventory: {
          userId: id,
        },
      },
    });

    await prisma.inventory.deleteMany({
      where: {
        userId: id,
      },
    });

    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleStatus(id) {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    await prisma.user.update({
      where: { id },
      data: {
        isActivated: !user.isActivated,
      },
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function updateRole(id, role) {
  try {
    await prisma.user.update({
      where: { id },
      data: { role },
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    throw error;
  }
}

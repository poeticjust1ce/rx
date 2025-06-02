"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        manager: {
          select: {
            name: true,
          },
        },
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

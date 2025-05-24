"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

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

  try {
    // 1. First get ALL users from the database
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        managerId: true,
      },
    });

    console.log("All users from DB:", allUsers);

    // 2. Filter manually in JavaScript
    const availableUsers = allUsers.filter((user) => {
      const isRegularUser = user.role === "user";
      const hasNoManager =
        user.managerId === null || user.managerId === undefined;
      const isNotCurrentUser = user.id !== session.user.id;

      return isRegularUser && hasNoManager && isNotCurrentUser;
    });

    console.log("Filtered available users:", availableUsers);
    return availableUsers;
  } catch (error) {
    console.error("Error in getAvailableUsers:", error);
    throw error;
  }
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

export async function removeFromTeam(formData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const userId = formData.get("userId");

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { managerId: true },
    });

    if (!user) throw new Error("User not found");
    if (user.managerId !== session.user.id)
      throw new Error("Not authorized to remove this user");

    await prisma.user.update({
      where: { id: userId },
      data: { managerId: null },
    });

    return { success: true, message: "User removed from team successfully" };
  } catch (error) {
    console.error("Remove from team error:", error);
    throw error;
  }
}

export async function getUserInventory(userId) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const inventory = await prisma.inventory.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return inventory?.items || [];
}

export async function getUserDeliveries(userId) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  return await prisma.delivery.findMany({
    where: {
      deliveredBy: userId,
    },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      deliveryDate: "desc",
    },
  });
}

export async function generateInventoryReport(formData) {
  const userId = formData.get("userId");
  const userName = formData.get("userName");
  const inventory = await getUserInventory(userId);

  return {
    type: "inventory",
    userName,
    data: inventory.map((item) => ({
      ...item,
      supplierName: item.supplier?.name || "N/A",
    })),
  };
}

export async function generateDeliveryReport(formData) {
  const userId = formData.get("userId");
  const userName = formData.get("userName");
  const deliveries = await getUserDeliveries(userId);

  return {
    type: "deliveries",
    userName,
    data: deliveries,
  };
}

"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getUserDashboardData() {
  const session = await auth();
  if (!session?.user)
    return { stats: {}, recentTransfers: [], lowStockItems: [] };

  const inventory = await prisma.inventory.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        where: { quantity: { lt: 10 } }, // Low stock threshold
        orderBy: { quantity: "asc" },
        take: 5,
      },
    },
  });

  const recentTransfers = await prisma.transfer.findMany({
    where: {
      OR: [{ senderId: session.user.id }, { receiverId: session.user.id }],
    },
    include: {
      product: true,
      sender: { select: { name: true } },
      receiver: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = {
    totalItems: inventory?.items.length || 0,
    lowStock: inventory?.items.filter((i) => i.quantity < 5).length || 0,
    pendingTransfers: recentTransfers.filter((t) => t.status === "pending")
      .length,
    recentActivity: recentTransfers.length,
  };

  return {
    stats,
    recentTransfers,
    lowStockItems: inventory?.items || [],
  };
}

"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getUserInventory() {
  const session = await auth();
  if (!session?.user) return { items: [] };

  const inventory = await prisma.inventory.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          supplier: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          quantity: "asc",
        },
      },
    },
  });

  return inventory || { items: [] };
}

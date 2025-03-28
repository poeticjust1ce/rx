"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function createDelivery(deliveryData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    // Validate items
    if (!deliveryData.items || deliveryData.items.length === 0) {
      throw new Error("At least one item is required");
    }

    const delivery = await prisma.delivery.create({
      data: {
        deliveryDate: new Date(deliveryData.deliveryDate),
        orNumber: deliveryData.orNumber,
        invoiceNumber: deliveryData.invoiceNumber,
        remarks: deliveryData.remarks,
        customer: {
          connect: { id: deliveryData.customerId },
        },
        user: {
          connect: { id: session.user.id },
        },
        items: {
          create: deliveryData.items.map((item) => ({
            quantity: item.quantity,
            notes: item.notes || null, // Handle optional notes
            product: {
              connect: { id: item.productId },
            },
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Update inventory
    for (const item of delivery.items) {
      await prisma.inventoryItem.update({
        where: { id: item.productId },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    revalidatePath("/user/deliveries");
    return { success: true, delivery };
  } catch (error) {
    console.error("Error in createDelivery:", error);
    return { success: false, error: error.message };
  }
}

export async function getDeliveries() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  return await prisma.delivery.findMany({
    where: {
      deliveredBy: session.user.id,
    },
    include: {
      customer: true,
      user: {
        select: {
          name: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      deliveryDate: "desc",
    },
  });
}

"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getPendingTransfers() {
  const session = await auth();
  if (!session?.user) return [];

  return await prisma.transfer.findMany({
    where: {
      receiverId: session.user.id,
      status: "pending",
    },
    include: {
      product: {
        select: {
          name: true,
          batchNumber: true,
        },
      },
      sender: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function approveTransfer(transferId) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return await prisma.$transaction(async (prisma) => {
    // 1. Get the transfer with all necessary relations
    const transfer = await prisma.transfer.findUnique({
      where: { id: transferId },
      include: {
        product: {
          include: {
            supplier: true,
            inventory: true,
          },
        },
        receiver: {
          include: {
            inventory: {
              include: {
                items: true,
              },
            },
          },
        },
      },
    });

    if (!transfer) {
      throw new Error("Transfer not found");
    }

    if (transfer.receiverId !== session.user.id) {
      throw new Error("You can only approve transfers sent to you");
    }

    // 2. Verify sufficient quantity in source inventory
    if (transfer.product.quantity < transfer.quantity) {
      throw new Error("Insufficient quantity available for transfer");
    }

    // 3. Get or create receiver's inventory
    let receiverInventory = transfer.receiver.inventory;
    if (!receiverInventory) {
      receiverInventory = await prisma.inventory.create({
        data: {
          userId: transfer.receiverId,
          isAdminInventory: false,
        },
        include: {
          items: true,
        },
      });
    }

    // 4. Check for existing matching item in receiver's inventory
    const existingItem = receiverInventory.items.find(
      (item) =>
        item.name === transfer.product.name &&
        item.batchNumber === transfer.product.batchNumber &&
        item.expirationDate === transfer.product.expirationDate
    );

    // 5. Update or create the inventory item
    if (existingItem) {
      await prisma.inventoryItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: { increment: transfer.quantity },
          expirationDate: transfer.product.expirationDate,
        },
      });
    } else {
      await prisma.inventoryItem.create({
        data: {
          name: transfer.product.name,
          quantity: transfer.quantity,
          batchNumber: transfer.product.batchNumber,
          expirationDate: transfer.product.expirationDate,
          inventoryId: receiverInventory.id,
          supplierId: transfer.product.supplierId,
        },
      });
    }

    // 6. Decrement sender's inventory
    await prisma.inventoryItem.update({
      where: { id: transfer.product.id },
      data: { quantity: { decrement: transfer.quantity } },
    });

    // 7. Update transfer status
    await prisma.transfer.update({
      where: { id: transferId },
      data: { status: "accepted" },
    });

    revalidatePath("/user/transfers");
    return { success: true };
  });
}

export async function rejectTransfer(transferId) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const transfer = await prisma.transfer.findUnique({
    where: { id: transferId },
  });

  if (!transfer) {
    throw new Error("Transfer not found");
  }

  if (transfer.receiverId !== session.user.id) {
    throw new Error("You can only reject transfers sent to you");
  }

  await prisma.transfer.update({
    where: { id: transferId },
    data: { status: "rejected" },
  });

  revalidatePath("/user/transfers");
  return { success: true };
}

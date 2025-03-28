"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function transferInventoryItem({
  productId,
  receiverId,
  quantity,
  remarks,
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify the receiver is part of the manager's team
  const isTeamMember = await prisma.user.findFirst({
    where: {
      id: receiverId,
      managerId: session.user.id,
    },
  });

  if (!isTeamMember) {
    throw new Error("You can only transfer to your team members");
  }

  try {
    // Check product availability
    const product = await prisma.inventoryItem.findUnique({
      where: { id: productId },
      include: { inventory: true },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.inventory.userId !== session.user.id) {
      throw new Error("You can only transfer from your own inventory");
    }

    if (product.quantity < quantity) {
      throw new Error(`Insufficient quantity (available: ${product.quantity})`);
    }

    // Create transfer record
    const transfer = await prisma.transfer.create({
      data: {
        productId,
        senderId: session.user.id,
        receiverId,
        quantity,
        remarks,
        status: "pending",
      },
    });

    // Update sender's inventory
    await prisma.inventoryItem.update({
      where: { id: productId },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });

    // Add to receiver's inventory or create if doesn't exist
    const receiverInventory = await prisma.inventory.findUnique({
      where: { userId: receiverId },
    });

    if (receiverInventory) {
      await prisma.inventoryItem.upsert({
        where: {
          inventoryId_name: {
            inventoryId: receiverInventory.id,
            name: product.name,
          },
        },
        update: {
          quantity: {
            increment: quantity,
          },
        },
        create: {
          name: product.name,
          quantity,
          batchNumber: product.batchNumber,
          expirationDate: product.expirationDate,
          inventoryId: receiverInventory.id,
          supplierId: product.supplierId,
        },
      });
    }

    revalidatePath("/manager/transfers");
    return { success: true, transfer };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function completeTransfer(transferId, action) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const transfer = await prisma.transfer.findUnique({
      where: { id: transferId },
      include: {
        product: true,
        sender: true,
        receiver: true,
      },
    });

    if (!transfer) {
      throw new Error("Transfer not found");
    }

    // Verify the manager is either sender or receiver's manager
    if (
      transfer.senderId !== session.user.id &&
      transfer.receiver.managerId !== session.user.id
    ) {
      throw new Error("Unauthorized to manage this transfer");
    }

    if (action === "reject") {
      // Return items to sender
      await prisma.$transaction([
        prisma.inventoryItem.update({
          where: { id: transfer.productId },
          data: {
            quantity: {
              increment: transfer.quantity,
            },
          },
        }),
        prisma.transfer.update({
          where: { id: transferId },
          data: {
            status: "rejected",
          },
        }),
      ]);
    } else if (action === "accept") {
      await prisma.transfer.update({
        where: { id: transferId },
        data: {
          status: "accepted",
        },
      });
    }

    revalidatePath("/manager/transfers");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

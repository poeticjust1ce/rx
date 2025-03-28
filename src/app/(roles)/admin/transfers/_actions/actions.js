// app/(roles)/admin/transfers/_actions/actions.js
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTransfers(status = "all") {
  const where = status === "all" ? {} : { status };

  return await prisma.transfer.findMany({
    where,
    include: {
      product: true,
      sender: { select: { name: true } },
      receiver: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function approveTransfer(transferId) {
  return handleTransferAction(transferId, "accept");
}

export async function rejectTransfer(transferId) {
  return handleTransferAction(transferId, "reject");
}

async function handleTransferAction(transferId, action) {
  try {
    const transfer = await prisma.transfer.findUnique({
      where: { id: transferId },
      include: {
        product: {
          include: {
            supplier: true, // Include supplier to preserve relationship
          },
        },
        receiver: { include: { inventory: true } },
      },
    });

    if (!transfer) throw new Error("Transfer not found");

    // If accepting, ensure product details are preserved
    if (action === "accept") {
      await prisma.$transaction([
        prisma.transfer.update({
          where: { id: transferId },
          data: { status: "accepted" },
        }),
        // Update receiver's inventory
        ...(transfer.receiver.inventory
          ? [
              prisma.inventoryItem.create({
                data: {
                  name: transfer.product.name,
                  quantity: transfer.quantity,
                  batchNumber: transfer.product.batchNumber,
                  expirationDate: transfer.product.expirationDate, // Correct field name
                  inventoryId: transfer.receiver.inventory.id,
                  supplierId: transfer.product.supplierId,
                },
              }),
            ]
          : []),
      ]);
    } else {
      await prisma.transfer.update({
        where: { id: transferId },
        data: { status: "rejected" },
      });
    }

    revalidatePath("/admin/transfers");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

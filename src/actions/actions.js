"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";

const transferSchema = z.object({
  productId: z.string().min(1, "You should select a product"),
  senderId: z.string().min(1),
  receiverId: z.string().min(1),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  remarks: z.string().optional(),
});

export async function Transfer(prevState, formData) {
  const result = transferSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const { productId, senderId, receiverId, quantity, remarks } = result.data;

  const senderInventory = await prisma.inventory.findFirst({
    where: { userId: senderId },
  });

  if (!senderInventory) {
    return { error: "Sender has no inventory" };
  }

  const senderInventoryItem = await prisma.inventoryItem.findFirst({
    where: {
      inventoryId: senderInventory.id,
      id: productId,
    },
  });

  if (!senderInventoryItem || senderInventoryItem.quantity < quantity) {
    return { error: "Insufficient stock" };
  }

  await prisma.inventoryItem.update({
    where: { id: senderInventoryItem.id },
    data: { quantity: senderInventoryItem.quantity - quantity },
  });

  let receiverInventory = await prisma.inventory.findFirst({
    where: { userId: receiverId },
  });

  if (!receiverInventory) {
    receiverInventory = await prisma.inventory.create({
      data: { userId: receiverId },
    });
  }

  let receiverInventoryItem = await prisma.inventoryItem.findFirst({
    where: {
      inventoryId: receiverInventory.id,
      name: senderInventoryItem.name,
    },
  });

  if (receiverInventoryItem) {
    await prisma.inventoryItem.update({
      where: { id: receiverInventoryItem.id },
      data: { quantity: receiverInventoryItem.quantity + quantity },
    });
  } else {
    await prisma.inventoryItem.create({
      data: {
        name: senderInventoryItem.name,
        inventoryId: receiverInventory.id,
        quantity,
        batchNumber: senderInventoryItem.batchNumber,
        expirationDate: senderInventoryItem.expirationDate,
        supplierId: senderInventoryItem.supplierId,
      },
    });
  }

  await prisma.transfer.create({
    data: {
      productId,
      senderId,
      receiverId,
      quantity,
      remarks,
    },
  });

  redirect("/admin/employee-inventory");
}

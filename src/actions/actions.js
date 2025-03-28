"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";

const transferSchema = z.object({
  productId: z.string().min(1, "You should select a product"), // This is actually an InventoryItem ID
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

  // ✅ 1. Find sender's inventory
  const senderInventory = await prisma.inventory.findFirst({
    where: { userId: senderId },
  });

  if (!senderInventory) {
    return { error: "Sender has no inventory" };
  }

  // ✅ 2. Find the product in sender's inventory
  const senderInventoryItem = await prisma.inventoryItem.findFirst({
    where: {
      inventoryId: senderInventory.id,
      id: productId, // ✅ Correct way to find the item
    },
  });

  if (!senderInventoryItem || senderInventoryItem.quantity < quantity) {
    return { error: "Insufficient stock" };
  }

  // ✅ 3. Deduct from sender's inventory
  await prisma.inventoryItem.update({
    where: { id: senderInventoryItem.id },
    data: { quantity: senderInventoryItem.quantity - quantity },
  });

  // ✅ 4. Find or create receiver's inventory
  let receiverInventory = await prisma.inventory.findFirst({
    where: { userId: receiverId },
  });

  if (!receiverInventory) {
    receiverInventory = await prisma.inventory.create({
      data: { userId: receiverId },
    });
  }

  // ✅ 5. Find or create receiver's inventory item
  let receiverInventoryItem = await prisma.inventoryItem.findFirst({
    where: {
      inventoryId: receiverInventory.id,
      name: senderInventoryItem.name, // We match by product name because it's a different inventory
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
        name: senderInventoryItem.name, // ✅ Keep product name
        inventoryId: receiverInventory.id, // ✅ Assign to receiver's inventory
        quantity,
        batchNumber: senderInventoryItem.batchNumber, // ✅ Preserve batch info
        expirationDate: senderInventoryItem.expirationDate, // ✅ Preserve expiration date
        supplierId: senderInventoryItem.supplierId, // ✅ Keep supplier reference
      },
    });
  }

  // ✅ 6. Record the transfer
  await prisma.transfer.create({
    data: {
      productId, // This still refers to the InventoryItem ID
      senderId,
      receiverId,
      quantity,
      remarks,
    },
  });

  redirect("/admin/employee-inventory");
}

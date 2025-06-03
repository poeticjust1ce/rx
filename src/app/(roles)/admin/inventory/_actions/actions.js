"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  quantity: z.coerce.number().min(1, "Quantity must be greater than 0"),
  supplierId: z.string().min(1, "Supplier must be selected"),
  batchNumber: z.string().min(1, "Batch number is required"),
  expirationDate: z.string().min(1, "Expiration date is required"),
});

export async function getInventoryItems() {
  try {
    const inventory = await prisma.inventory.findFirst({
      where: { isAdminInventory: true },
      include: {
        items: {
          include: {
            supplier: true,
          },
        },
      },
    });
    return inventory?.items || [];
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
}

export async function getSuppliers() {
  try {
    return await prisma.supplier.findMany();
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return [];
  }
}

export async function addProduct(id, formData) {
  const result = productSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!result.success) {
    return { errors: result.error.formErrors.fieldErrors };
  }

  const data = result.data;

  const inventory = await getInventoryForCurrentUser();

  await prisma.inventoryItem.create({
    data: { ...data, inventoryId: inventory.id },
  });

  revalidatePath("/admin/inventory");
  return { success: true };
}

export async function editProduct(id, prevState, formData) {
  const result = productSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!result.success) {
    return { errors: result.error.formErrors.fieldErrors };
  }

  const data = result.data;
  await prisma.inventoryItem.update({ where: { id }, data });

  revalidatePath("/admin/inventory");
  return { success: true };
}

export async function deleteItem(id) {
  await prisma.inventoryItem.delete({ where: { id } });
  revalidatePath("/admin/inventory");
  return { success: true };
}

export async function transferInventoryItem({
  productId,
  receiverId,
  quantity,
  remarks,
}) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("Unauthorized - Please log in");
    }

    if (!productId || !receiverId || !quantity) {
      throw new Error("Missing required fields");
    }
    if (quantity <= 0) {
      throw new Error("Quantity must be positive");
    }

    let receiverInventory =
      (await prisma.inventory.findUnique({
        where: { userId: receiverId },
      })) ||
      (await prisma.inventory.create({
        data: { userId: receiverId },
      }));

    const transfer = await prisma.transfer.create({
      data: {
        productId,
        senderId: session.user.id,
        receiverId,
        quantity: parseInt(quantity),
        remarks: remarks || null,
        status: "pending",
      },
    });

    revalidatePath("/admin/employee-inventory");
    return {
      success: true,
      data: transfer,
    };
  } catch (error) {
    console.error("Transfer failed:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function completeTransfer({ transferId, action }) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("Unauthorized - Please log in");
    }

    const transfer = await prisma.transfer.findUnique({
      where: { id: transferId },
      include: {
        product: true,
        receiver: { include: { inventory: true } },
        sender: { include: { inventory: true } },
      },
    });

    if (!transfer) {
      throw new Error("Transfer not found");
    }

    if (action === "accept") {
      // Verify product still exists and has sufficient quantity
      const product = await prisma.inventoryItem.findUnique({
        where: { id: transfer.productId },
      });

      if (!product) {
        throw new Error("Product no longer exists");
      }

      if (product.quantity < transfer.quantity) {
        throw new Error("Insufficient product quantity");
      }

      // Find or create item in receiver's inventory
      const receiverInventory =
        transfer.receiver.inventory ||
        (await prisma.inventory.create({
          data: { userId: transfer.receiverId },
        }));

      const existingItem = await prisma.inventoryItem.findFirst({
        where: {
          inventoryId: receiverInventory.id,
          name: transfer.product.name,
          batchNumber: transfer.product.batchNumber,
        },
      });

      if (existingItem) {
        await prisma.inventoryItem.update({
          where: { id: existingItem.id },
          data: { quantity: { increment: transfer.quantity } },
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
      await prisma.inventoryItem.update({
        where: { id: transfer.productId },
        data: { quantity: { decrement: transfer.quantity } },
      });
    }

    await prisma.transfer.update({
      where: { id: transferId },
      data: { status: action === "accept" ? "accepted" : "rejected" },
    });

    revalidatePath("/admin/employee-inventory");
    return { success: true };
  } catch (error) {
    console.error("Transfer completion failed:", error);
    return { success: false, error: error.message };
  }
}

async function getInventoryForCurrentUser() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized - Please log in");
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  if (userRole === "admin") {
    let inventory = await prisma.inventory.findFirst({
      where: { isAdminInventory: true },
    });

    if (!inventory) {
      inventory = await prisma.inventory.create({
        data: { isAdminInventory: true },
      });
    }
    return inventory;
  } else {
    let inventory = await prisma.inventory.findUnique({
      where: { userId },
    });

    if (!inventory) {
      inventory = await prisma.inventory.create({
        data: {
          user: { connect: { id: userId } },
          isAdminInventory: false,
        },
      });
    }
    return inventory;
  }
}

"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const supplierSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export async function createSupplier(formData) {
  try {
    const validatedData = supplierSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
    });

    await prisma.supplier.create({
      data: validatedData,
    });
    revalidatePath("/admin/suppliers");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.flatten().fieldErrors };
    }
    return { error: error.message };
  }
}

export async function editSupplier(id, formData) {
  try {
    const validatedData = supplierSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
    });

    await prisma.supplier.update({
      where: { id },
      data: validatedData,
    });
    revalidatePath("/admin/suppliers");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.flatten().fieldErrors };
    }
    return { error: error.message };
  }
}

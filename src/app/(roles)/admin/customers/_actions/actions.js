"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const customerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  location: z.string().min(1, "Location is required"),
});

export async function createCustomer(formData) {
  try {
    const validatedData = customerSchema.parse({
      name: formData.get("name"),
      location: formData.get("location"),
    });

    await prisma.customer.create({
      data: validatedData,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.flatten().fieldErrors };
    }
    throw error;
  }
}

export async function editCustomer(id, formData) {
  try {
    const validatedData = customerSchema.parse({
      name: formData.get("name"),
      location: formData.get("location"),
    });

    await prisma.customer.update({
      where: { id },
      data: validatedData,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.flatten().fieldErrors };
    }
    throw error;
  }
}

export async function deleteCustomer(id) {
  try {
    await prisma.customer.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    throw error;
  }
}

"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "./prisma";
import { getSession } from "./auth";

export async function handleServerAction(action, successPath) {
  try {
    const result = await action();
    if (successPath) {
      revalidatePath(successPath);
      redirect(successPath);
    }
    return { success: true, data: result };
  } catch (error) {
    console.error("Server action error:", error);
    return { success: false, error: error.message };
  }
}

export async function withServerAction(action, successPath) {
  return async (formData) => {
    return handleServerAction(() => action(formData), successPath);
  };
}

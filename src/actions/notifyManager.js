"use server";

import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

export async function notifyAssignedManager(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        manager: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user || !user.manager) {
      console.warn(`User or manager not found for user ID: ${userId}`);
      return;
    }

    await pusher.trigger(
      `private-manager-${user.manager.id}`,
      "user-checked-in",
      {
        title: "User Check-In",
        message: `${user.name} has checked in.`,
        userId,
      }
    );

    console.log(`Notification sent to manager ${user.manager.name}`);
  } catch (error) {
    console.error("Failed to notify manager:", error);
  }
}

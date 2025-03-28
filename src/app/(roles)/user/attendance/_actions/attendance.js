"use server";

import prisma from "@/lib/prisma";
import { put } from "@vercel/blob";
import { redirect } from "next/navigation";

export async function checkIn(prevState, formData) {
  const userId = formData.get("userId");
  const location = formData.get("location");
  const image = formData.get("image");

  if (!userId || !location || !image) {
    return { error: "Missing required data" };
  }

  try {
    // Upload image to Vercel Blob Storage
    const imageBuffer = Buffer.from(image.split(",")[1], "base64");
    const blob = await put(`attendance/${Date.now()}.jpg`, imageBuffer, {
      access: "public",
      contentType: "image/jpeg",
    });

    // Save attendance record in MongoDB
    await prisma.attendance.create({
      data: {
        userId,
        location,
        photoUrl: blob.url,
        timeIn: new Date(),
      },
    });

    redirect("/attendance");
  } catch (error) {
    console.error("Check-in failed:", error);
    return { error: "Failed to check in" };
  }
}

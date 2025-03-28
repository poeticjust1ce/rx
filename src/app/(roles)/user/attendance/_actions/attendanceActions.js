"use server";

import prisma from "@/lib/prisma";
import { put } from "@vercel/blob";

export async function checkInAttendance(formData) {
  try {
    const userId = formData.get("userId");
    const photoBase64 = formData.get("photoUrl");
    const location = formData.get("location");

    console.log("📝 Received Data:", { userId, photoBase64, location });

    if (!userId || !photoBase64 || !location) {
      console.error("❌ Missing required data");
      return { error: "Missing required data" };
    }

    // Extract base64 content
    const base64Data = photoBase64.split(",")[1];

    if (!base64Data) {
      console.error("❌ Invalid image format");
      return { error: "Invalid image format" };
    }

    // Convert to buffer
    const buffer = Buffer.from(base64Data, "base64");

    if (!buffer.length) {
      console.error("❌ Buffer conversion failed");
      return { error: "Failed to process image data" };
    }

    console.log("✅ Buffer created successfully. Uploading...");

    // Upload to Vercel Blob Storage
    const blob = await put(`attendance/${userId}-${Date.now()}.png`, buffer, {
      access: "public",
      contentType: "image/png",
    });

    console.log("✅ Image uploaded successfully:", blob.url);

    // Save to database
    const attendance = await prisma.attendance.create({
      data: {
        userId,
        photoUrl: blob.url,
        location,
        timeIn: new Date(),
      },
    });

    console.log("✅ Attendance saved successfully:", attendance);

    return { success: true, attendance }; // 🔥 Return full attendance record
  } catch (error) {
    console.error("❌ Check-in error:", error);
    return { error: "Failed to check in" }; // ⚠️ Ensure this is handled in frontend
  }
}

// ✅ Function for checking out
export async function checkOutAttendance(attendanceId) {
  try {
    console.log("📢 Attempting check-out for:", attendanceId);

    if (!attendanceId) {
      console.error("❌ Invalid attendanceId:", attendanceId);
      return { error: "Invalid attendance record." };
    }

    // Ensure we are targeting the correct attendance
    const existingAttendance = await prisma.attendance.findUnique({
      where: { id: attendanceId },
    });

    if (!existingAttendance) {
      console.error("❌ Attendance record not found for ID:", attendanceId);
      return { error: "Attendance record not found." };
    }

    if (existingAttendance.timeOut) {
      console.error("❌ Already checked out:", existingAttendance);
      return { error: "You have already checked out." };
    }

    console.log("🧐 Found correct attendance record:", existingAttendance);

    const updatedAttendance = await prisma.attendance.update({
      where: { id: existingAttendance.id },
      data: { timeOut: new Date() },
    });

    console.log("✅ Check-out successful:", updatedAttendance);
    return { success: true };
  } catch (error) {
    console.error("❌ Check-out error:", error);
    return { error: "Failed to check out." };
  }
}

// ✅ Function to get today's attendance
export async function getTodayAttendance(userId) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findFirst({
      where: {
        userId,
        timeIn: { gte: today },
      },
      orderBy: { timeIn: "desc" }, // Get latest attendance entry
    });

    return attendance; // Return the full record (even if checked out)
  } catch (error) {
    console.error("❌ Attendance fetch error:", error);
    return null;
  }
}

export async function getLatestAttendance(userId) {
  try {
    return await prisma.attendance.findFirst({
      where: { userId },
      orderBy: { timeIn: "desc" }, // Get the most recent record
    });
  } catch (error) {
    console.error("Attendance fetch error:", error);
    return null;
  }
}

export async function getAttendanceHistory(userId) {
  try {
    const records = await prisma.attendance.findMany({
      where: { userId },
      orderBy: { timeIn: "desc" }, // Show most recent first
    });
    return records;
  } catch (error) {
    console.error("Error fetching attendance history:", error);
    return [];
  }
}

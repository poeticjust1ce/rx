"use server";
import { pusher } from "@/lib/pusher";
export async function triggerNotification(message) {
  console.log("📨 message received in triggerNotification:", message);
  if (!message || typeof message !== "string") {
    console.warn("⚠️ Invalid message:", message);
    return;
  }

  try {
    await pusher.trigger("notifications", "toast-event", { message });
    console.log("✅ Triggered successfully!");
  } catch (err) {
    console.error("❌ Pusher error:", err);
  }
}

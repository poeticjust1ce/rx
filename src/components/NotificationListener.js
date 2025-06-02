"use client";

import { useEffect } from "react";
import Pusher from "pusher-js";
import { toast } from "sonner";

export default function NotificationListener() {
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY, {
      cluster: process.env.NEXT_PUBLIC_CLUSTER,
    });

    const channel = pusher.subscribe("notifications");
    channel.bind("toast-event", (data) => {
      toast(data.message);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return null;
}

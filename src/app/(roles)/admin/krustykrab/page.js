"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { triggerNotification } from "@/actions/notify";
const page = () => {
  const [announcement, setAnnouncement] = useState("");

  const announceHandler = () => {
    if (announcement.length > 0) {
      if (
        confirm(`Are you sure that you want to announce: \n "${announcement}"?`)
      ) {
        triggerNotification(announcement);
      } else return;
    } else {
      alert("wag ka magsayang ng api sa walang kwentang bagay");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-[0.5rem]">pangs nga eh!!!</h1>
      <div className="text-center">
        <Textarea
          onChange={(e) => setAnnouncement(e.target.value)}
          className="resize-none h-[8rem]"
          placeholder="What do you want to announce."
        />
        <Button onClick={announceHandler} className="mt-2 rounded-full h-10">
          Announce 📢
        </Button>
      </div>
    </div>
  );
};

export default page;

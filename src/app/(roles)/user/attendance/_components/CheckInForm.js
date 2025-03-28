"use client";

import { useState, useEffect, useRef } from "react";
import { checkInAttendance } from "../_actions/attendanceActions"; // Action for saving check-in
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam";

export default function CheckInForm({ userId }) {
  const [location, setLocation] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(true);
  const webcamRef = useRef(null);
  const { pending } = useFormStatus();

  useEffect(() => {
    // Fetch user location only when the component is loaded
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await response.json();
        setLocation(data.display_name);
        setLoadingLocation(false);
      },
      (error) => {
        console.error("Error getting location", error);
        setLoadingLocation(false);
      }
    );
  }, []);

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setPhotoUrl(imageSrc);
    }
  };

  return (
    <form action={checkInAttendance} className="space-y-4">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="photoUrl" value={photoUrl} />
      <input type="hidden" name="location" value={location} />

      <Webcam
        ref={webcamRef}
        screenshotFormat="image/png"
        className="rounded-md"
      />
      <Button type="button" onClick={capturePhoto} className="mt-2">
        Capture Photo
      </Button>

      <Button
        type="submit"
        disabled={!photoUrl || !location || loadingLocation || pending}
      >
        {pending ? "Checking in..." : "Confirm Check In"}
      </Button>
    </form>
  );
}

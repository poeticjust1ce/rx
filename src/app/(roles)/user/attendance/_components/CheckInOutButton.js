"use client";

import { useEffect, useState, useRef } from "react";
import moment from "moment-timezone";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  checkInAttendance,
  checkOutAttendance,
  getLatestAttendance,
} from "../_actions/attendanceActions";

export default function CheckInOutButton({ userId }) {
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [attendanceId, setAttendanceId] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [location, setLocation] = useState("");
  const [locationName, setLocationName] = useState("");
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latestAttendance, setLatestAttendance] = useState(null);

  useEffect(() => {
    async function fetchAttendance() {
      const attendance = await getLatestAttendance(userId);
      if (attendance) {
        setLatestAttendance(attendance);
        setHasCheckedIn(!attendance.timeOut); // If no timeOut, user is still checked in
        setAttendanceId(attendance.id);
      } else {
        setHasCheckedIn(false);
        setAttendanceId(null);
      }
    }
    fetchAttendance();
  }, [userId]);

  useEffect(() => {
    setCurrentTime(
      moment().tz("Asia/Hong_Kong").format("📅 MMMM DD, YYYY 🕒 hh:mm:ss A")
    );
    const interval = setInterval(() => {
      setCurrentTime(
        moment().tz("Asia/Hong_Kong").format("📅 MMMM DD, YYYY 🕒 hh:mm:ss A")
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchLocation = () => {
    setIsLocationLoading(true);
    setLocation("📍 Loading location...");
    setLocationName("📍 Loading location...");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`Lat: ${latitude}, Lng: ${longitude}`);

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            setLocationName(data.display_name || "Unknown location");
          } catch (error) {
            setLocationName("❌ Unable to fetch address");
          } finally {
            setIsLocationLoading(false);
          }
        },
        () => {
          setIsLocationLoading(false);
          setLocationName("❌ Unable to fetch address");
        }
      );
    } else {
      setIsLocationLoading(false);
      setLocationName("❌ Geolocation not supported");
    }
  };

  useEffect(() => {
    if (isDrawerOpen) {
      fetchLocation(); // 🔥 Auto-fetch location when drawer opens
    }
  }, [isDrawerOpen]);

  const captureImage = () => {
    const screenshot = webcamRef.current.getScreenshot();
    setImage(screenshot);
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();

    if (!location || !image) {
      toast.error("❌ Location and photo are required!");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("photoUrl", image);
      formData.append("location", locationName);

      const response = await checkInAttendance(formData);

      if (response?.success) {
        toast.success("✅ Checked in successfully!");
        setHasCheckedIn(true);
        setAttendanceId(response.attendance.id);
        setLatestAttendance(response.attendance);
        setIsDrawerOpen(false); // ✅ Close the drawer after checking in
      } else {
        toast.error(response?.message || "❌ Check-in failed.");
      }
    } catch (error) {
      console.error("Check-in error:", error);
      toast.error("❌ Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckOut = async () => {
    if (!attendanceId) return;

    setIsSubmitting(true);

    try {
      const response = await checkOutAttendance(attendanceId);

      if (response?.success) {
        toast.success("✅ Checked out successfully!");
        setHasCheckedIn(false);
        setLatestAttendance((prev) => ({ ...prev, timeOut: new Date() }));
      } else {
        toast.error(response?.message || "❌ Check-out failed.");
      }
    } catch (error) {
      console.error("Check-out error:", error);
      toast.error("❌ Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-lg font-semibold">{currentTime}</div>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button variant="destructive" disabled={hasCheckedIn}>
            Check In
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="flex items-center justify-center">
            <DrawerTitle>📸 Check In</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col items-center space-y-4 p-4">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full max-w-sm rounded-lg border"
            />
            <Button variant="outline" onClick={captureImage}>
              Capture Photo
            </Button>
            <div className="w-[80%] flex flex-col">
              <p className="text-sm text-gray-500">🌍 {location}</p>
              <p className="text-sm text-gray-200 font-semibold">
                📍{" "}
                {locationName ||
                  (isLocationLoading ? "Loading..." : "No location")}
              </p>
            </div>
            <form onSubmit={handleCheckIn}>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  isLocationLoading ||
                  !locationName ||
                  locationName.startsWith("❌") ||
                  !image
                }
              >
                {isSubmitting ? "Checking In..." : "Confirm Check In"}
              </Button>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
      <Button
        variant="secondary"
        onClick={handleCheckOut}
        disabled={!hasCheckedIn || isSubmitting}
      >
        Check Out
      </Button>
      {latestAttendance ? (
        <div className="p-4 border rounded-lg bg-gray-800 text-white">
          <p>
            📅 Date: {moment(latestAttendance.timeIn).format("MMMM DD, YYYY")}
          </p>
          <p>⏰ Time In: {moment(latestAttendance.timeIn).format("hh:mm A")}</p>
          {latestAttendance.timeOut ? (
            <p>
              ✅ Checked Out at:{" "}
              {moment(latestAttendance.timeOut).format("hh:mm A")}
            </p>
          ) : (
            <p>🚨 Currently Checked In</p>
          )}
        </div>
      ) : (
        <p className="text-gray-500">No attendance records found.</p>
      )}
    </div>
  );
}

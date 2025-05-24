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
  const [facingMode, setFacingMode] = useState("user");

  useEffect(() => {
    async function fetchAttendance() {
      const attendance = await getLatestAttendance(userId);
      if (attendance) {
        setLatestAttendance(attendance);
        setHasCheckedIn(!attendance.timeOut);
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
      moment().tz("Asia/Hong_Kong").format("MMMM DD, YYYY • hh:mm:ss A")
    );
    const interval = setInterval(() => {
      setCurrentTime(
        moment().tz("Asia/Hong_Kong").format("MMMM DD, YYYY • hh:mm:ss A")
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchLocation = () => {
    setIsLocationLoading(true);
    setLocation("Loading location...");
    setLocationName("Loading location...");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            setLocationName(data.display_name || "Unknown location");
          } catch (error) {
            setLocationName("Unable to fetch address");
          } finally {
            setIsLocationLoading(false);
          }
        },
        () => {
          setIsLocationLoading(false);
          setLocationName("Location access denied");
        }
      );
    } else {
      setIsLocationLoading(false);
      setLocationName("Geolocation not supported");
    }
  };

  useEffect(() => {
    if (isDrawerOpen) {
      fetchLocation();
    }
  }, [isDrawerOpen]);

  const captureImage = () => {
    const screenshot = webcamRef.current.getScreenshot();
    setImage(screenshot);
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();

    if (!location || !image) {
      toast.error("Location and photo are required!");
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
        toast.success("Checked in successfully!");
        setHasCheckedIn(true);
        setAttendanceId(response.attendance.id);
        setLatestAttendance(response.attendance);
        setIsDrawerOpen(false);
      } else {
        toast.error(response?.message || "Check-in failed.");
      }
    } catch (error) {
      console.error("Check-in error:", error);
      toast.error("Something went wrong.");
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
        toast.success("Checked out successfully!");
        setHasCheckedIn(false);
        setLatestAttendance((prev) => ({ ...prev, timeOut: new Date() }));
      } else {
        toast.error(response?.message || "Check-out failed.");
      }
    } catch (error) {
      console.error("Check-out error:", error);
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-6">
      {/* Time Display */}
      <div className="text-center">
        <div className="text-sm font-medium text-gray-500">Current Time</div>
        <div className="text-xl font-semibold text-gray-800 mt-1">
          {currentTime}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-4">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button
              variant={hasCheckedIn ? "outline" : "default"}
              size="lg"
              className="w-full py-6 text-lg"
              disabled={hasCheckedIn}
            >
              {hasCheckedIn ? "Already Checked In" : "Check In"}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[90vh]">
            <DrawerHeader>
              <DrawerTitle className="text-center text-xl font-bold text-gray-800">
                Check In Verification
              </DrawerTitle>
            </DrawerHeader>
            <div className="px-6 pb-6 space-y-4 overflow-y-auto">
              {/* Webcam Preview */}
              <div className="relative">
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode }}
                  className="w-full rounded-lg border shadow-sm"
                />
                {image && (
                  <div className="absolute inset-0 border-4 border-green-500 rounded-lg pointer-events-none" />
                )}
              </div>

              {/* Camera Controls */}
              <div className="flex gap-3 justify-center">
                <Button
                  type="button"
                  onClick={captureImage}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                  {image ? "Retake" : "Capture"}
                </Button>
                <Button
                  type="button"
                  onClick={switchCamera}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h7a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7M9 4H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
                    <polyline points="16 16 12 12 16 8" />
                    <line x1="12" y1="12" x2="21" y2="12" />
                  </svg>
                  Switch Camera
                </Button>
              </div>

              {/* Location Information */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 text-gray-500"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-gray-700">
                      Coordinates
                    </div>
                    <div className="text-sm text-gray-600">{location}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 text-gray-500"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-gray-700">
                      Address
                    </div>
                    <div className="text-sm text-gray-600">
                      {isLocationLoading ? (
                        <span className="inline-flex items-center gap-1">
                          <svg
                            className="animate-spin h-4 w-4 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Locating...
                        </span>
                      ) : (
                        locationName
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <form onSubmit={handleCheckIn} className="w-full">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-2"
                  disabled={
                    isSubmitting ||
                    isLocationLoading ||
                    !locationName ||
                    locationName.startsWith("Unable") ||
                    !image
                  }
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Confirm Check In"
                  )}
                </Button>
              </form>
            </div>
          </DrawerContent>
        </Drawer>

        <Button
          variant={hasCheckedIn ? "default" : "outline"}
          size="lg"
          className="w-full py-6 text-lg"
          onClick={handleCheckOut}
          disabled={!hasCheckedIn || isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Check Out"}
        </Button>
      </div>

      {/* Attendance Status */}
      {latestAttendance ? (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
          <h3 className="font-semibold text-gray-800 text-center mb-2">
            Latest Attendance
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">Date:</div>
            <div className="text-gray-800 font-medium">
              {moment(latestAttendance.timeIn).format("MMMM DD, YYYY")}
            </div>

            <div className="text-gray-600">Time In:</div>
            <div className="text-gray-800 font-medium">
              {moment(latestAttendance.timeIn).format("hh:mm A")}
            </div>

            <div className="text-gray-600">Status:</div>
            <div className="text-gray-800 font-medium">
              {latestAttendance.timeOut ? (
                <span className="text-green-600">Checked Out</span>
              ) : (
                <span className="text-blue-600">Currently Checked In</span>
              )}
            </div>

            {latestAttendance.timeOut && (
              <>
                <div className="text-gray-600">Time Out:</div>
                <div className="text-gray-800 font-medium">
                  {moment(latestAttendance.timeOut).format("hh:mm A")}
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-4">
          No attendance records found
        </div>
      )}
    </div>
  );
}

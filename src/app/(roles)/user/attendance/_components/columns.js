"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

import moment from "moment-timezone";
import { Button } from "@/components/ui/button";
import { formatDuration, intervalToDuration } from "date-fns";

export const columns = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => moment(row.original.timeIn).format("MMMM DD, YYYY"),
  },
  {
    accessorKey: "timeIn",
    header: "Time In",
    cell: ({ row }) => moment(row.original.timeIn).format("hh:mm A"),
  },
  {
    accessorKey: "timeOut",
    header: "Time Out",
    cell: ({ row }) =>
      row.original.timeOut
        ? moment(row.original.timeOut).format("hh:mm A")
        : "🚨 Still Checked In",
  },
  {
    accessorKey: "duration",
    header: "Total Time",
    cell: ({ row }) => {
      const timeIn = new Date(row.original.timeIn);
      const timeOut = row.original.timeOut
        ? new Date(row.original.timeOut)
        : null;

      if (!timeOut) return <Badge variant="secondary">Ongoing</Badge>;

      const duration = intervalToDuration({ start: timeIn, end: timeOut });
      return formatDuration(duration, {
        format: ["hours", "minutes", "seconds"],
      });
    },
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "photoUrl",
    header: "Photo",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      return row.original.photoUrl ? (
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTitle></DialogTitle>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                View Photo
              </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center">
              <img
                src={row.original.photoUrl}
                alt="Attendance Proof"
                className="w-full max-w-lg rounded-lg"
              />
            </DialogContent>
          </Dialog>
        </>
      ) : (
        "No Photo"
      );
    },
  },
];

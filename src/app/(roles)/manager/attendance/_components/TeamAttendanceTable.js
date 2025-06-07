"use client";

import { DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format, intervalToDuration, formatDuration } from "date-fns";

export const columns = [
  {
    accessorKey: "user.name",
    header: "Name",
  },
  {
    accessorKey: "timeIn",
    header: "Time In",
    cell: ({ row }) => format(new Date(row.getValue("timeIn")), "PPpp"),
  },
  {
    accessorKey: "timeOut",
    header: "Time Out",
    cell: ({ row }) =>
      row.getValue("timeOut") ? (
        format(new Date(row.getValue("timeOut")), "PPpp")
      ) : (
        <Badge variant="secondary">Still working</Badge>
      ),
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

export function TeamAttendanceTable({ data }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="user.name"
      filterOptions={{
        status: ["Late", "On time"],
      }}
    />
  );
}

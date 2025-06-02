"use client";

import { DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const timeIn = new Date(row.getValue("timeIn"));
      const isLate =
        timeIn.getHours() > 9 ||
        (timeIn.getHours() === 9 && timeIn.getMinutes() > 0);
      return isLate ? (
        <Badge variant="destructive">Late</Badge>
      ) : (
        <Badge variant="default">On time</Badge>
      );
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

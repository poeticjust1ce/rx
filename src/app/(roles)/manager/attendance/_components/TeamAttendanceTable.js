// src/app/(roles)/manager/attendance/_components/TeamAttendanceTable.jsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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

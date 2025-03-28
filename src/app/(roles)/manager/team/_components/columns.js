// src/app/(roles)/manager/my-team/_components/columns.jsx
"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditTeamMemberModal } from "./EditTeamMemberModal";

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role");
      return <span className="capitalize">{role}</span>;
    },
  },
  {
    accessorKey: "isActivated",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActivated");
      return (
        <span className={isActive ? "text-green-500" : "text-red-500"}>
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <EditTeamMemberModal user={user}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </EditTeamMemberModal>
            <DropdownMenuItem
              onClick={async () => {
                // Move the deactivate logic here or call a client-side function
                console.log("Deactivate/Activate", user.id);
              }}
            >
              {user.isActivated ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

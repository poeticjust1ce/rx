"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { removeFromTeam } from "../_actions/actions";

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
      const { toast } = useToast();

      const handleRemove = async () => {
        try {
          await removeFromTeam(user.id);
          toast({
            title: "Success",
            description: `${user.name} has been removed from the team`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={handleRemove}
              className="text-red-600 focus:text-red-600"
            >
              Remove from team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

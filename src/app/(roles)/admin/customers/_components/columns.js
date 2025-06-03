"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteCustomer } from "../_actions/actions";
import { toast } from "sonner";

export const columns = [
  {
    accessorKey: "name",
    header: "Customer",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;

      const handleDelete = async (id) => {
        try {
          await deleteCustomer(id);
          toast("Customer deleted successfully");
          window.location.reload();
        } catch (error) {
          toast.error("Error deleting customer");
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
              onClick={() => {
                const button = document.getElementById(
                  `edit-customer-${customer.id}`
                );
                if (button) button.click();
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDelete(customer.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

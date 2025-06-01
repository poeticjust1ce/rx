"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const userInventoryColumns = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.name}
        {row.original.batchNumber && (
          <div className="text-sm text-muted-foreground">
            Batch: {row.original.batchNumber}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      const quantity = row.original.quantity;
      return (
        <Badge
          variant={
            quantity < 5 ? "destructive" : quantity < 10 ? "warning" : "default"
          }
          className="justify-center w-20"
        >
          {quantity} in stock
        </Badge>
      );
    },
  },
  {
    accessorKey: "expirationDate",
    header: "Expires",
    cell: ({ row }) => {
      const date = row.original.expirationDate;
      return date ? (
        <div className="text-sm">
          {new Date(date).toLocaleDateString()}
          {new Date(date) < new Date() && (
            <span className="text-destructive ml-2">Expired</span>
          )}
        </div>
      ) : (
        "N/A"
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(item.id)}
            >
              Copy item ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

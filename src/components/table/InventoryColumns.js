"use client";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export const columns = [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <div className="text-center">
        <span className="font-semibold">{row.getValue("quantity")}</span>
      </div>
    ),
  },
  {
    accessorKey: "batchNumber",
    header: "Batch No.",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.getValue("batchNumber") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "expirationDate",
    header: "Exp. Date",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.getValue("expirationDate") || "N/A"}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.id)}
            >
              Copy product ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/admin/inventory/${product.id}`)}
            >
              View details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

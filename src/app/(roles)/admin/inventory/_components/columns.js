// app/(roles)/admin/inventory/_components/columns.js
"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { deleteItem } from "../_actions/actions";

export const getColumns = (setEditingProduct, setIsDialogOpen, refreshData) => [
  {
    id: "name",
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => (
      <div className="font-medium text-xs sm:text-sm">
        {row.original.name.length > 15
          ? `${row.original.name.substring(0, 15)}...`
          : row.original.name}
      </div>
    ),
  },
  {
    id: "quantity",
    accessorKey: "quantity",
    header: "Qty",
    cell: ({ row }) => (
      <div className="text-xs sm:text-sm">{row.original.quantity}</div>
    ),
  },
  {
    id: "supplier",
    header: "Supplier",
    cell: ({ row }) => (
      <div className="text-xs sm:text-sm">
        {row.original.supplier?.name
          ? row.original.supplier.name.length > 10
            ? `${row.original.supplier.name.substring(0, 10)}...`
            : row.original.supplier.name
          : "N/A"}
      </div>
    ),
  },
  {
    id: "batchNumber",
    accessorKey: "batchNumber",
    header: "Batch",
    cell: ({ row }) => (
      <div className="text-xs sm:text-sm font-mono">
        {row.original.batchNumber.length > 8
          ? `${row.original.batchNumber.substring(0, 8)}...`
          : row.original.batchNumber}
      </div>
    ),
  },
  {
    id: "expirationDate",
    header: "Expiry",
    cell: ({ row }) => (
      <div className="text-xs sm:text-sm">
        {new Date(row.original.expirationDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 sm:h-8 sm:w-8"
          onClick={() => {
            setEditingProduct(row.original);
            setIsDialogOpen(true);
          }}
        >
          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 hover:bg-red-50"
          onClick={async () => {
            await deleteItem(row.original.id);
            refreshData();
          }}
        >
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    ),
  },
];

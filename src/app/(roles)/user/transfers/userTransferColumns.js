"use client";

import { Button } from "@/components/ui/button";
import { approveTransfer, rejectTransfer } from "./_actions/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

export const userTransferColumns = [
  {
    accessorKey: "product.name",
    header: "Product",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.product.name}
        <div className="text-sm text-muted-foreground">
          Batch: {row.original.product.batchNumber || "N/A"}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <div className="font-semibold text-center">{row.original.quantity}</div>
    ),
  },
  {
    accessorKey: "sender.name",
    header: "From",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.original.sender.name}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Requested",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleString()}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const transfer = row.original;

      const handleAction = async (action) => {
        try {
          const result =
            action === "approve"
              ? await approveTransfer(transfer.id)
              : await rejectTransfer(transfer.id);

          if (result.success) {
            toast.success(
              `You've ${action}d the transfer of ${transfer.product.name}`
            );
            router.refresh();
          } else {
            throw new Error(result.error);
          }
        } catch (error) {
          toast("Action failed");
        }
      };

      return (
        <div className="flex gap-2 justify-end">
          <Button
            size="sm"
            variant="success"
            onClick={() => handleAction("approve")}
            className="gap-1"
          >
            <Check size={16} /> Accept
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleAction("reject")}
            className="gap-1"
          >
            <X size={16} /> Reject
          </Button>
        </div>
      );
    },
  },
];

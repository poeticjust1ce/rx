// components/transfers/TransferDetailsModal.js
"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { StatusBadge } from "./StatusBadge";

export function TransferDetailsModal({ transfer, open, onOpenChange }) {
  if (!transfer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Transfer Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Status:</span>
            <div className="col-span-3">
              <StatusBadge status={transfer.status} />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Product:</span>
            <span className="col-span-3">{transfer.product.name}</span>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Quantity:</span>
            <span className="col-span-3">{transfer.quantity}</span>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">From:</span>
            <span className="col-span-3">{transfer.sender.name}</span>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">To:</span>
            <span className="col-span-3">{transfer.receiver.name}</span>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Date:</span>
            <span className="col-span-3">
              {format(new Date(transfer.createdAt), "PPpp")}
            </span>
          </div>

          {transfer.remarks && (
            <div className="grid grid-cols-4 items-start gap-4">
              <span className="text-sm font-medium">Remarks:</span>
              <p className="col-span-3 text-sm text-muted-foreground">
                {transfer.remarks}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

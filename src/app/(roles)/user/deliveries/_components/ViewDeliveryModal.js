// app/(roles)/user/deliveries/_components/ViewDeliveryModal.js
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

export function ViewDeliveryModal({ delivery, open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Delivery Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">
                Delivery Date
              </h3>
              <p>{format(new Date(delivery.deliveryDate), "MMM dd, yyyy")}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">
                Customer
              </h3>
              <p>{delivery.customer.name}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">
                OR Number
              </h3>
              <p>{delivery.orNumber || "-"}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">
                Invoice Number
              </h3>
              <p>{delivery.invoiceNumber || "-"}</p>
            </div>
          </div>

          {delivery.remarks && (
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">
                Remarks
              </h3>
              <p className="whitespace-pre-line">{delivery.remarks}</p>
            </div>
          )}

          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">
              Items Delivered
            </h3>
            <div className="border rounded-lg divide-y">
              {delivery.items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 grid grid-cols-3 gap-4 items-center"
                >
                  <div>
                    <h4 className="font-medium">Product</h4>
                    <p className="text-sm">{item.product.name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Quantity</h4>
                    <p className="text-sm">{item.quantity}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Notes</h4>
                    <p className="text-sm">{item.notes || "-"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

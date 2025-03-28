"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useState } from "react";
import { ViewDeliveryModal } from "./ViewDeliveryModal";

export function DeliveryLogTable({ deliveries }) {
  const [viewingDelivery, setViewingDelivery] = useState(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>OR #</TableHead>
            <TableHead>Invoice #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items Delivered</TableHead>
            <TableHead>Remarks</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveries.map((delivery) => (
            <TableRow key={delivery.id}>
              <TableCell>
                {format(new Date(delivery.deliveryDate), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>{delivery.orNumber || "-"}</TableCell>
              <TableCell>{delivery.invoiceNumber || "-"}</TableCell>
              <TableCell>{delivery.customer.name}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {delivery.items.map((item) => (
                    <span key={item.id} className="text-sm">
                      {item.product.name} ({item.quantity})
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {delivery.remarks || "-"}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewingDelivery(delivery)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {viewingDelivery && (
        <ViewDeliveryModal
          delivery={viewingDelivery}
          open={!!viewingDelivery}
          onOpenChange={(open) => !open && setViewingDelivery(null)}
        />
      )}
    </>
  );
}

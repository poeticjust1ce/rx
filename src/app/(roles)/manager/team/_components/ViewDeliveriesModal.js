"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Printer } from "lucide-react";
import { generateDeliveryReport } from "../_actions/actions";

export function ViewDeliveriesModal({ userId, userName, children }) {
  const [open, setOpen] = useState(false);
  const [deliveries, setDeliveries] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadDeliveries = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("userName", userName);

      const result = await generateDeliveryReport(formData);
      setDeliveries(result);
    } catch (error) {
      console.error("Failed to load deliveries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        asChild
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        {children}
      </DialogTrigger>
      <DialogContent
        className="max-w-4xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{userName}'s Deliveries</DialogTitle>
        </DialogHeader>

        {!deliveries ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <Button
              onClick={async (e) => {
                e.preventDefault();
                await loadDeliveries();
              }}
              disabled={isLoading}
              className="w-fit"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load Deliveries"
              )}
            </Button>
          </div>
        ) : (
          <>
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Customer</th>
                    <th className="text-left p-2">Items</th>
                    <th className="text-left p-2">OR Number</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.data.map((delivery) => (
                    <tr key={delivery.id} className="border-b">
                      <td className="p-2">
                        {new Date(delivery.deliveryDate).toLocaleDateString()}
                      </td>
                      <td className="p-2">{delivery.customer.name}</td>
                      <td className="p-2">
                        <ul className="list-disc pl-4">
                          {delivery.items.map((item) => (
                            <li key={item.id}>
                              {item.product.name} ({item.quantity})
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-2">{delivery.orNumber || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => {
                  const printWindow = window.open("", "_blank");
                  printWindow.document.write(`
                    <html>
                      <head>
                        <title>${userName}'s Deliveries</title>
                        <style>
                          body { font-family: Arial; margin: 20px; }
                          h1 { color: #333; }
                          table { width: 100%; border-collapse: collapse; }
                          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                          th { background-color: #f2f2f2; }
                        </style>
                      </head>
                      <body>
                        <h1>${userName}'s Deliveries</h1>
                        <table>
                          <tr>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>OR Number</th>
                          </tr>
                          ${deliveries.data
                            .map(
                              (delivery) => `
                            <tr>
                              <td>${new Date(
                                delivery.deliveryDate
                              ).toLocaleDateString()}</td>
                              <td>${delivery.customer.name}</td>
                              <td>
                                <ul>
                                  ${delivery.items
                                    .map(
                                      (item) => `
                                    <li>${item.product.name} (${item.quantity})</li>
                                  `
                                    )
                                    .join("")}
                                </ul>
                              </td>
                              <td>${delivery.orNumber || "N/A"}</td>
                            </tr>
                          `
                            )
                            .join("")}
                        </table>
                        <script>
                          setTimeout(() => {
                            window.print();
                            window.close();
                          }, 200);
                        </script>
                      </body>
                    </html>
                  `);
                }}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Report
              </Button>
              <Button
                variant="outline"
                className="ml-2"
                onClick={() => setDeliveries(null)}
              >
                Reload Data
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

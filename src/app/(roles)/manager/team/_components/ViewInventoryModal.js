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
import { generateInventoryReport } from "../_actions/actions";
import { PrintReport } from "./PrintReport";

export function ViewInventoryModal({ userId, userName, children }) {
  const [open, setOpen] = useState(false);
  const [inventory, setInventory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("userName", userName);

      const result = await generateInventoryReport(formData);
      setInventory(result);
    } catch (error) {
      console.error("Failed to load inventory:", error);
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
          <DialogTitle>{userName}'s Inventory</DialogTitle>
        </DialogHeader>

        {!inventory ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <Button
              onClick={async (e) => {
                e.preventDefault();
                await loadInventory();
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
                "Load Inventory"
              )}
            </Button>
          </div>
        ) : (
          <>
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Item</th>
                    <th className="text-left p-2">Quantity</th>
                    <th className="text-left p-2">Batch</th>
                    <th className="text-left p-2">Expiration</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.data.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">{item.quantity}</td>
                      <td className="p-2">{item.batchNumber || "N/A"}</td>
                      <td className="p-2">{item.expirationDate || "N/A"}</td>
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
                        <title>${userName}'s Inventory</title>
                        <style>
                          body { font-family: Arial; margin: 20px; }
                          h1 { color: #333; }
                          table { width: 100%; border-collapse: collapse; }
                          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                          th { background-color: #f2f2f2; }
                        </style>
                      </head>
                      <body>
                        <h1>${userName}'s Inventory</h1>
                        <table>
                          <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Batch</th>
                            <th>Expiration</th>
                          </tr>
                          ${inventory.data
                            .map(
                              (item) => `
                            <tr>
                              <td>${item.name}</td>
                              <td>${item.quantity}</td>
                              <td>${item.batchNumber || "N/A"}</td>
                              <td>${item.expirationDate || "N/A"}</td>
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
                onClick={() => setInventory(null)}
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

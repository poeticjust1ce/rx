"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintReport({ report }) {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    if (report.type === "inventory") {
      printWindow.document.write(`
        <html>
          <head>
            <title>${report.userName}'s Inventory</title>
            <style>
              body { font-family: Arial; margin: 20px; }
              h1 { color: #333; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>${report.userName}'s Inventory</h1>
            <table>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Batch</th>
                <th>Expiration</th>
              </tr>
              ${report.data
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
    } else {
      // Delivery report template
      printWindow.document.write(`
        <html>
          <head>
            <title>${report.userName}'s Deliveries</title>
            <style>
              body { font-family: Arial; margin: 20px; }
              h1 { color: #333; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>${report.userName}'s Deliveries</h1>
            <table>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>OR Number</th>
              </tr>
              ${report.data
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
    }
  };

  return (
    <Button onClick={handlePrint}>
      <Printer className="mr-2 h-4 w-4" />
      Print Report
    </Button>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, Clock } from "lucide-react";

export function InventoryStats({ inventory }) {
  const totalItems = inventory.items.length;
  const lowStock = inventory.items.filter((i) => i.quantity < 5).length;
  const expired = inventory.items.filter(
    (i) => i.expirationDate && new Date(i.expirationDate) < new Date()
  ).length;

  return (
    <div className="flex gap-4">
      <Card className="w-32">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-2xl font-bold">{totalItems}</span>
        </CardContent>
      </Card>

      <Card className="w-32">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <span className="text-2xl font-bold">{lowStock}</span>
        </CardContent>
      </Card>

      <Card className="w-32">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Expired</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-red-500" />
          <span className="text-2xl font-bold">{expired}</span>
        </CardContent>
      </Card>
    </div>
  );
}

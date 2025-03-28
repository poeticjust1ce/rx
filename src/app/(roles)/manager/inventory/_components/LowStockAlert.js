"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export function LowStockAlert({ items }) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Low Stock Alert</AlertTitle>
      <AlertDescription>
        You have {items.length} item{items.length > 1 ? "s" : ""} with less than
        5 in stock.{" "}
        <Link
          href="/user/transfers"
          className="font-medium underline hover:text-primary"
        >
          Request more
        </Link>
      </AlertDescription>
    </Alert>
  );
}

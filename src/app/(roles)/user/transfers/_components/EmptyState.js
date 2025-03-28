"use client";

import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/50">
      <PackageSearch size={48} className="text-muted-foreground mb-4" />
      <h3 className="text-xl font-medium mb-2">No pending transfers</h3>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        You don't have any pending inventory transfers. When an admin or manager
        sends you items, they'll appear here.
      </p>
      <Button asChild>
        <Link href="/user/inventory">View Your Inventory</Link>
      </Button>
    </div>
  );
}

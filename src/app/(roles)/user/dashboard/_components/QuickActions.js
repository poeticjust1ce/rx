"use client";

import { Button } from "@/components/ui/button";
import { Plus, History, ClipboardList, TruckIcon } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Button asChild variant="outline" className="h-24 flex-col gap-2">
          <Link href="/user/attendance">
            <ClipboardList className="h-5 w-5" />
            <span className="text-sm">Check In</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-24 flex-col gap-2">
          <Link href="/user/deliveries">
            <TruckIcon className="h-5 w-5" />
            <span className="text-sm">New Delivery</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-24 flex-col gap-2">
          <Link href="/user/transfers">
            <Plus className="h-5 w-5" />
            <span className="text-sm">New Request</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-24 flex-col gap-2">
          <Link href="/user/transfers/history">
            <History className="h-5 w-5" />
            <span className="text-sm">Transfer History</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

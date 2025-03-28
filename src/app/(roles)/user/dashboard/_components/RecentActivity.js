"use client";

import { Clock, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function RecentActivity({ transfers }) {
  return (
    <div className="space-y-4">
      {transfers.length > 0 ? (
        transfers.map((transfer) => (
          <div
            key={transfer.id}
            className="flex items-start gap-3 p-2 border-b last:border-b-0"
          >
            <div className="flex-shrink-0 mt-1">
              {transfer.status === "pending" ? (
                <Clock className="h-4 w-4 text-yellow-500" />
              ) : transfer.status === "accepted" ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{transfer.product.name}</p>
              <p className="text-sm text-muted-foreground">
                From {transfer.sender.name} •{" "}
                {new Date(transfer.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Badge
              variant={
                transfer.status === "pending"
                  ? "warning"
                  : transfer.status === "accepted"
                  ? "success"
                  : "destructive"
              }
              className="text-xs"
            >
              {transfer.status}
            </Badge>
          </div>
        ))
      ) : (
        <p className="text-muted-foreground text-sm p-4">No recent activity</p>
      )}
    </div>
  );
}

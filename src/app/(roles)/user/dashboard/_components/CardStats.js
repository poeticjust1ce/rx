"use client";

import { Package, AlertTriangle, Clock, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  package: Package,
  alert: AlertTriangle,
  clock: Clock,
  activity: Activity,
};

export function CardStats({ title, value, icon, trend }) {
  const Icon = iconMap[icon] || Package;

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold">{value}</p>
        <p
          className={cn(
            "text-xs mt-1 flex items-center",
            trend === "positive"
              ? "text-green-500"
              : trend === "negative"
              ? "text-red-500"
              : "text-muted-foreground"
          )}
        >
          {trend === "positive" && "↑ "}
          {trend === "negative" && "↓ "}
          {trend === "neutral" && "→ "}
          Compared to last week
        </p>
      </div>
    </div>
  );
}

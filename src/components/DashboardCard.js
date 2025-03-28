import React from "react";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

const DashboardCard = ({
  header,
  count,
  secondaryText,
  icon,
  className = "",
  iconClass = "",
  trend,
}) => (
  <Card className={`border ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {header}
      </CardTitle>
      <div className={`p-2 rounded-lg ${iconClass}/20`}>
        {React.cloneElement(icon, { className: `w-5 h-5 ${iconClass}` })}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{count}</div>
      {secondaryText && (
        <p className="text-xs text-muted-foreground">{secondaryText}</p>
      )}
      {trend && (
        <div className="flex items-center text-xs mt-1">
          {trend === "up" ? (
            <>
              <ArrowUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500 ml-1">Increasing</span>
            </>
          ) : (
            <>
              <ArrowDown className="w-3 h-3 text-red-500" />
              <span className="text-red-500 ml-1">Decreasing</span>
            </>
          )}
        </div>
      )}
    </CardContent>
  </Card>
);

export default DashboardCard;

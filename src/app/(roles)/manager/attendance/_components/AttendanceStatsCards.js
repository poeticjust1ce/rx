"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AttendanceStatsCards({ data }) {
  const stats = {
    total: data.length,
    present: data.filter((a) => a.timeOut === null).length,
    late: data.filter((a) => {
      const timeIn = new Date(a.timeIn);
      return (
        timeIn.getHours() > 9 ||
        (timeIn.getHours() === 9 && timeIn.getMinutes() > 0)
      );
    }).length,
  };

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Present Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            {stats.present}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-500">{stats.late}</div>
        </CardContent>
      </Card>
    </div>
  );
}

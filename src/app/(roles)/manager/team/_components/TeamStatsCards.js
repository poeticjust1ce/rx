// src/app/(roles)/manager/my-team/_components/TeamStatsCards.jsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TeamStatsCards({ members }) {
  const stats = {
    total: members.length,
    active: members.filter((m) => m.isActivated).length,
    managers: members.filter((m) => m.role === "manager").length,
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            {stats.active}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Managers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.managers}</div>
        </CardContent>
      </Card>
    </div>
  );
}

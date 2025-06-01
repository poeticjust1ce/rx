import { CardStats } from "./_components/CardStats";
import { RecentActivity } from "./_components/RecentActivity";
import { QuickActions } from "./_components/QuickActions";
import { getUserDashboardData } from "./_actions/actions";

export default async function UserDashboardPage() {
  const { stats, recentTransfers } = await getUserDashboardData();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Your Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your inventory and recent activity
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CardStats
          title="Total Items"
          value={stats.totalItems}
          icon="package"
        />
        <CardStats title="Low Stock" value={stats.lowStock} icon="alert" />
        <CardStats
          title="Pending Transfers"
          value={stats.pendingTransfers}
          icon="clock"
        />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6">
          <QuickActions />

          <div className="bg-white rounded-lg border shadow-sm p-4 overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4">Recent Transfers</h2>
            <RecentActivity transfers={recentTransfers} />
          </div>
        </div>
      </div>
    </div>
  );
}

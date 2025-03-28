import DashboardCard from "@/components/DashboardCard";
import {
  UserCog,
  Pill,
  Syringe,
  CalendarDays,
  PackageOpen,
  Hospital,
  Activity,
  Clock,
  AlertCircle,
  Truck,
  UserPlus,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import moment from "moment-timezone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Activity icons mapping
const activityIcons = {
  login: <Activity className="w-5 h-5 text-blue-500" />,
  inventory: <PackageOpen className="w-5 h-5 text-green-500" />,
  transfer: <Truck className="w-5 h-5 text-purple-500" />,
  user: <UserPlus className="w-5 h-5 text-yellow-500" />,
  Default: <AlertCircle className="w-5 h-5 text-gray-500" />,
};

export default async function DashboardPage() {
  const session = await auth();

  // Parallel data fetching
  const [users, customers, suppliers, products, activities] = await Promise.all(
    [
      prisma.user.findMany(),
      prisma.customer.findMany(),
      prisma.supplier.findMany(),
      prisma.inventory.findFirst({
        where: { isAdminInventory: session.user.role === "admin" },
        include: { items: true },
      }),
      prisma.activity.findMany({
        orderBy: { timestamp: "desc" },
        take: 5,
      }),
    ]
  );

  // Calculate inventory value
  const inventoryValue =
    products?.items.reduce(
      (sum, item) => sum + item.quantity * (item.price || 0),
      0
    ) || 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {session.user.name} 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening right now
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-accent/50 px-4 py-2 rounded-lg">
          <CalendarDays className="w-5 h-5 text-primary" />
          <p className="font-medium">{moment().format("dddd, MMMM Do YYYY")}</p>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          header="Total Staff"
          count={users.length}
          icon={<UserCog className="w-6 h-6 text-blue-500" />}
          className="bg-blue-500/10 border-blue-500"
          iconClass="text-blue-500"
        />
        <DashboardCard
          header="Products"
          count={products?.items.length || 0}
          icon={<Pill className="w-6 h-6 text-green-500" />}
          className="bg-green-500/10 border-green-500"
          iconClass="text-green-500"
        />
        <DashboardCard
          header="Customers"
          count={customers.length}
          icon={<Hospital className="w-6 h-6 text-red-500" />}
          className="bg-yellow-500/10 border-yellow-500"
          iconClass="text-yellow-500"
        />
        <DashboardCard
          header="Suppliers"
          count={suppliers.length}
          icon={<Syringe className="w-6 h-6 text-orange-500" />}
          className="bg-red-500/10 border-red-500"
          iconClass="text-red-500"
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">
              Recent Activity
            </CardTitle>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Last 5 actions</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 hover:bg-accent/50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {activityIcons[activity.type] || activityIcons.Default}
                      <div>
                        <p className="font-medium">{activity.message}</p>
                        <p className="text-sm text-muted-foreground">
                          {moment(activity.timestamp).fromNow()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {activity.type}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Activity className="w-8 h-8 mb-2" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Inventory Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Total Products
              </span>
              <span className="font-medium">{products?.items.length || 0}</span>
            </div>

            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Low Stock Items
              </span>
              <span className="font-medium">
                {products?.items.filter((i) => i.quantity < 10).length || 0}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Expiring Soon
              </span>
              <span className="font-medium">
                {products?.items.filter(
                  (i) =>
                    i.expirationDate &&
                    new Date(i.expirationDate) <
                      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                ).length || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

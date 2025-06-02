import DashboardCard from "@/components/DashboardCard";
import {
  Users,
  Pill,
  CalendarDays,
  PackageOpen,
  Activity,
  Clock,
  AlertCircle,
  Truck,
  ArrowLeftRight,
  CalendarCheck,
  UserCheck,
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
  transfer: <ArrowLeftRight className="w-5 h-5 text-purple-500" />,
  delivery: <Truck className="w-5 h-5 text-orange-500" />,
  attendance: <UserCheck className="w-5 h-5 text-teal-500" />,
  Default: <AlertCircle className="w-5 h-5 text-gray-500" />,
};

export default async function ManagerDashboardPage() {
  const session = await auth();
  const [teamMembers, inventory, recentTransfers, activities, attendanceData] =
    await Promise.all([
      prisma.user.findMany({
        where: { managerId: session.user.id },
        include: {
          attendance: {
            orderBy: { timeIn: "desc" },
            take: 1,
          },
        },
      }),
      prisma.inventory.findFirst({
        where: { userId: session.user.id },
        include: { items: true },
      }),
      prisma.transfer.findMany({
        where: {
          OR: [{ senderId: session.user.id }, { receiverId: session.user.id }],
        },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: {
          product: true,
          sender: { select: { name: true } },
          receiver: { select: { name: true } },
        },
      }),
      prisma.activity.findMany({
        where: { userId: session.user.id },
        orderBy: { timestamp: "desc" },
        take: 5,
      }),
      prisma.attendance.findMany({
        where: {
          user: { managerId: session.user.id },
          timeIn: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
        include: { user: { select: { name: true } } },
      }),
    ]);

  const presentToday = attendanceData.filter((a) => a.timeOut === null).length;
  const lowStockItems =
    inventory?.items.filter((i) => i.quantity < 5).length || 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, Manager {session.user.name} 👋
          </h1>
          <p className="text-muted-foreground">Team and inventory overview</p>
        </div>
        <div className="flex items-center space-x-2 bg-accent/50 px-4 py-2 rounded-lg">
          <CalendarDays className="w-5 h-5 text-primary" />
          <p className="font-medium">{moment().format("dddd, MMMM Do YYYY")}</p>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          header="Team Members"
          count={teamMembers.length}
          icon={<Users className="w-6 h-6 text-blue-500" />}
          className="bg-blue-500/10 border-blue-500"
          iconClass="text-blue-500"
        />
        <DashboardCard
          header="Present Today"
          count={`${presentToday}/${teamMembers.length}`}
          icon={<UserCheck className="w-6 h-6 text-green-500" />}
          className="bg-green-500/10 border-green-500"
          iconClass="text-green-500"
        />
        <DashboardCard
          header="Inventory Items"
          count={inventory?.items.length || 0}
          icon={<Pill className="w-6 h-6 text-purple-500" />}
          className="bg-purple-500/10 border-purple-500"
          iconClass="text-purple-500"
        />
        <DashboardCard
          header="Low Stock Items"
          count={lowStockItems}
          icon={<AlertCircle className="w-6 h-6 text-orange-500" />}
          className="bg-orange-500/10 border-orange-500"
          iconClass="text-orange-500"
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
              Recent Transfers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTransfers.length > 0 ? (
              recentTransfers.map((transfer) => (
                <div key={transfer.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{transfer.product.name}</span>
                    <Badge variant="outline">
                      {transfer.senderId === session.user.id
                        ? "Sent"
                        : "Received"}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      {transfer.senderId === session.user.id
                        ? `To: ${transfer.receiver.name}`
                        : `From: ${transfer.sender.name}`}
                    </span>
                    <span>Qty: {transfer.quantity}</span>
                  </div>
                  <Separator />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <ArrowLeftRight className="w-8 h-8 mb-2" />
                <p>No recent transfers</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Today's Team Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendanceData.length > 0 ? (
              attendanceData.map((attendance) => (
                <div
                  key={attendance.id}
                  className="flex items-center justify-between p-3 hover:bg-accent/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <CalendarCheck className="w-5 h-5 text-teal-500" />
                    <div>
                      <p className="font-medium">{attendance.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {moment(attendance.timeIn).format("h:mm A")}
                        {attendance.timeOut &&
                          ` - ${moment(attendance.timeOut).format("h:mm A")}`}
                      </p>
                    </div>
                  </div>
                  <Badge variant={attendance.timeOut ? "default" : "secondary"}>
                    {attendance.timeOut ? "Completed" : "On Duty"}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <CalendarCheck className="w-8 h-8 mb-2" />
                <p>No attendance records today</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

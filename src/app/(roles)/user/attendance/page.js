import React from "react";
import { DataTable } from "@/components/table/DataTable";
import { columns } from "./_components/columns";
import { auth } from "@/lib/auth";
import { getAttendanceHistory } from "./_actions/attendanceActions";
import CheckInOutButton from "./_components/CheckInOutButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const page = async () => {
  const session = await auth();
  const userId = session.user?.id;

  const attendanceHistory = await getAttendanceHistory(userId); // Fetch history

  return (
    <div>
      <Card>
        <CardHeader title="Attendance System" />
        <CardContent>
          <CheckInOutButton userId={userId} />
        </CardContent>
        <CardFooter />
      </Card>
      <h1 className="text-xl font-semibold mb-2 mt-[1rem]">
        Attendance History
      </h1>
      <DataTable data={attendanceHistory} columns={columns} />
    </div>
  );
};

export default page;

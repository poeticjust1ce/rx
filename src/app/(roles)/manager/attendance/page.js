import { getTeamAttendance } from "./_actions/actions";
import { TeamAttendanceTable } from "./_components/TeamAttendanceTable";
import { AttendanceStatsCards } from "./_components/AttendanceStatsCards";
import { DateRangePicker } from "./_components/DateRangePicker";

export default async function TeamAttendancePage({ searchParams }) {
  const { from, to } = await searchParams;
  const attendanceData = await getTeamAttendance(from, to);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Team Attendance</h1>
        <DateRangePicker />
      </div>

      <AttendanceStatsCards data={attendanceData} />
      <TeamAttendanceTable data={attendanceData} />
    </div>
  );
}

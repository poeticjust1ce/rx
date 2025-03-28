// src/app/(roles)/manager/my-team/page.jsx
import { DataTable } from "@/components/table/DataTable";
import { columns } from "./_components/columns";
import { getMyTeam } from "./_actions/actions";
import { TeamStatsCards } from "./_components/TeamStatsCards";
import { SelectUserModal } from "./_components/SelectUserModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function MyTeamPage() {
  const teamMembers = await getMyTeam();

  // This will be passed to the modal to refresh the data
  async function refreshData() {
    "use server";
    return await getMyTeam();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Team</h1>
        <SelectUserModal refresh={refreshData}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </SelectUserModal>
      </div>

      <TeamStatsCards members={teamMembers} />

      <div className="mt-6">
        <DataTable columns={columns} data={teamMembers} searchKey="name" />
      </div>
    </div>
  );
}

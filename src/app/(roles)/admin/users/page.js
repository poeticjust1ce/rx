export const dynamic = "force-dynamic";
import React from "react";
import { DataTable } from "@/components/table/DataTable";
import { columns } from "./columns";

import { getUsers } from "./actions/actions";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage all system users and their permissions
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <DataTable columns={columns} data={users} className="border-0" />
      </div>
    </div>
  );
}

import { DataTable } from "@/components/table/DataTable";
import { userTransferColumns } from "../../../user/transfers/userTransferColumns";
import { getPendingTransfers } from "../../../user/transfers/_actions/actions";
import { EmptyState } from "../../../user/transfers/_components/EmptyState";

export default async function UserTransfersPage() {
  const transfers = await getPendingTransfers();

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Pending Transfers</h1>
        <div className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
            {transfers.length} Pending
          </span>
        </div>
      </div>

      {transfers.length > 0 ? (
        <div className="bg-white rounded-lg border shadow-sm">
          <DataTable
            columns={userTransferColumns}
            data={transfers}
            emptyMessage="No pending transfers"
          />
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

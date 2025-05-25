import { TransferHistoryTable } from "@/components/transfers/TransferHistoryTable";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ArrowLeftRight, PackageX, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";

const ITEMS_PER_PAGE = 10;

const TransfersPage = async ({ searchParams }) => {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const page = Number(searchParams?.page) || 1;
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const [transfers, totalTransfers] = await Promise.all([
    prisma.transfer.findMany({
      where: {
        OR: [{ senderId: session.user.id }, { receiverId: session.user.id }],
      },
      include: {
        product: {
          include: {
            inventory: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        sender: { select: { name: true, email: true } },
        receiver: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.transfer.count({
      where: {
        OR: [{ senderId: session.user.id }, { receiverId: session.user.id }],
      },
    }),
  ]);

  const isEmpty = transfers.length === 0;

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Transfer History</h1>
          <p className="text-muted-foreground">
            {isEmpty
              ? "Your transfer history will appear here"
              : `Showing ${transfers.length} of ${totalTransfers} transfers`}
          </p>
        </div>
        <Button asChild>
          <Link href="/manager/transfers">
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            New Transfer
          </Link>
        </Button>
      </div>

      {isEmpty ? (
        <EmptyState
          icon={<PackageX className="h-12 w-12 text-muted-foreground" />}
          title="No Transfers Yet"
          description="You haven't made or received any transfers yet. Start by creating a new transfer."
          action={
            <Button asChild>
              <Link href="/transfers/new">
                <PackageCheck className="mr-2 h-4 w-4" />
                Create First Transfer
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="bg-white rounded-lg border">
          <TransferHistoryTable
            transfers={transfers}
            totalItems={totalTransfers}
            currentPage={page}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>
      )}
    </div>
  );
};

export default TransfersPage;

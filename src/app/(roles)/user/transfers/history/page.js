import { TransferHistoryTable } from "@/components/transfers/TransferHistoryTable";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

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
        product: true,
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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Transfer History</h1>
      <TransferHistoryTable
        transfers={transfers}
        totalItems={totalTransfers}
        currentPage={page}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </div>
  );
};

export default TransfersPage;

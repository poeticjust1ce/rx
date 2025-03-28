// app/(roles)/manager/transfers/page.js
import { TeamInventoryDashboard } from "@/components/inventory/TeamInventoryDashboard";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

const page = async () => {
  const session = await auth();

  const [teamMembers, managerInventory, pendingTransfers] = await Promise.all([
    prisma.user.findMany({
      where: {
        managerId: session?.user.id, // Only get users managed by this manager
      },
      include: {
        inventory: {
          include: {
            items: {
              orderBy: { name: "asc" },
            },
          },
        },
      },
    }),
    prisma.inventory.findUnique({
      where: { userId: session?.user.id },
      include: {
        items: {
          where: { quantity: { gt: 0 } },
        },
      },
    }),
    prisma.transfer.findMany({
      where: {
        OR: [
          { senderId: session?.user.id, status: "pending" },
          { receiverId: session?.user.id, status: "pending" },
        ],
      },
      include: {
        product: true,
        receiver: true,
        sender: true,
      },
    }),
  ]);

  return (
    <div className="container mx-auto py-8">
      <TeamInventoryDashboard
        teamMembers={teamMembers}
        managerInventory={managerInventory}
        pendingTransfers={pendingTransfers}
      />
    </div>
  );
};

export default page;

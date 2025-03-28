import { EmployeeInventoryDashboard } from "@/components/inventory/EmployeeInventoryDashboard";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

const page = async () => {
  const session = await auth();

  const [users, inventory, pendingTransfers] = await Promise.all([
    prisma.user.findMany({
      include: {
        inventory: {
          include: {
            items: {
              orderBy: { name: "asc" },
            },
          },
        },
      },
      where: {
        role: { not: "admin" },
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
      <EmployeeInventoryDashboard
        users={users}
        currentInventory={inventory}
        pendingTransfers={pendingTransfers}
      />
    </div>
  );
};

export default page;

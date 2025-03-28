import { DeliveryLogTable } from "./_components/DeliveryLogTable";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import LogDeliveryModal from "./_components/LogDeliveryModal";

export default async function DeliveryLogPage() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const [deliveries, customers, userInventory] = await Promise.all([
    prisma.delivery.findMany({
      where: {
        deliveredBy: session.user.id,
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        deliveryDate: "desc",
      },
    }),
    prisma.customer.findMany(),
    prisma.inventory.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        items: true,
      },
    }),
  ]);

  const availableProducts = userInventory?.items || [];

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Deliveries</h1>
          <p className="text-sm text-muted-foreground">
            Your completed deliveries with OR and Invoice numbers
          </p>
        </div>
        <LogDeliveryModal customers={customers} products={availableProducts} />
      </div>

      <div className="bg-white rounded-lg border">
        <DeliveryLogTable deliveries={deliveries} />
      </div>
    </div>
  );
}

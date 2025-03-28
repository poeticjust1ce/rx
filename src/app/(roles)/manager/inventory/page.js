import { DataTable } from "@/components/table/DataTable";
import { userInventoryColumns } from "./userInventoryColumns";
import { getUserInventory } from "./_actions/actions";
import { InventoryStats } from "./_components/InventoryStats";
import { LowStockAlert } from "./_components/LowStockAlert";

export default async function UserInventoryPage() {
  const inventory = await getUserInventory();
  const lowStockItems = inventory.items.filter((item) => item.quantity < 5);

  return (
    <div className="container mx-auto py-4 md:py-8 space-y-4 md:space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Your Inventory</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {inventory.items.length} items assigned to you
          </p>
        </div>
        <InventoryStats inventory={inventory} />
      </div>

      {lowStockItems.length > 0 && <LowStockAlert items={lowStockItems} />}

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <DataTable
          columns={userInventoryColumns}
          data={inventory.items}
          emptyMessage="No inventory items assigned"
        />
      </div>
    </div>
  );
}

import prisma from "@/lib/prisma";
import { DataTable } from "@/components/table/DataTable";
import { columns } from "./_components/columns";
import AddCustomerButton from "./_components/AddCustomerButton";
import EditCustomerButton from "./_components/EditCustomerButton";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <AddCustomerButton />
      </div>

      <DataTable data={customers} columns={columns} />

      {/* Hidden edit buttons for each customer */}
      {customers.map((customer) => (
        <EditCustomerButton key={customer.id} customer={customer} />
      ))}
    </main>
  );
}

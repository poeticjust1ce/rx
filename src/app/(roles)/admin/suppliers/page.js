// app/(roles)/admin/suppliers/page.js
import { Button } from "@/components/ui/button";
import { PiPlus } from "react-icons/pi";
import prisma from "@/lib/prisma";
import { DataTable } from "@/components/table/DataTable";
import { columns } from "./_components/columns";
import AddSupplierButton from "./_components/AddSupplierButton";
import EditSupplierButton from "./_components/EditSupplierButton";

export default async function SuppliersPage() {
  const suppliers = await prisma.supplier.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <AddSupplierButton />
      </div>

      <DataTable data={suppliers} columns={columns} />

      {/* Render hidden edit buttons for each supplier */}
      {suppliers.map((supplier) => (
        <EditSupplierButton key={supplier.id} supplier={supplier} />
      ))}
    </main>
  );
}

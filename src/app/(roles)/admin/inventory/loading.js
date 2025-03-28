// app/(roles)/admin/inventory/loading.js
export default function Loading() {
  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
      </div>
      <div className="flex justify-center items-center h-64">
        <p>Loading inventory...</p>
      </div>
    </div>
  );
}

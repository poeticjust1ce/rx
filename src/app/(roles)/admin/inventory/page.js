// app/(roles)/admin/inventory/page.js
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InventoryTable } from "@/components/table/InventoryTable";
import { getColumns } from "./_components/columns";
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Plus, PackageSearch, RefreshCw } from "lucide-react";
import ProductForm from "./_components/ProductForm";
import { getInventoryItems, getSuppliers } from "./_actions/actions";
import { Input } from "@/components/ui/input";

export default function InventoryPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [data, setData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const [items, supplierData] = await Promise.all([
        getInventoryItems(),
        getSuppliers(),
      ]);
      setData(items);
      setSuppliers(supplierData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 py-4 w-full overflow-x-hidden">
      {/* Header Section */}
      <div className="flex flex-col gap-3 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Inventory</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage pharmaceutical products
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="relative w-full">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full text-sm sm:text-base"
            />
            <PackageSearch className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={loadData}
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
            >
              <RefreshCw className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTitle></DialogTitle>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="flex-1 sm:flex-none"
                  onClick={() => setEditingProduct(null)}
                >
                  <Plus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Add Product</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[700px]">
                <ProductForm
                  suppliers={suppliers}
                  onSuccess={() => {
                    setIsDialogOpen(false);
                    loadData();
                  }}
                  editData={editingProduct}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <InventoryTable
            columns={getColumns(setEditingProduct, setIsDialogOpen, loadData)}
            data={filteredData}
          />
        </div>
      </div>
    </div>
  );
}

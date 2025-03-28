"use client";
import { useState, useMemo, useRef } from "react";
import { completeTransfer } from "@/app/(roles)/admin/inventory/_actions/actions";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Printer, ArrowLeftRight, Search, User } from "lucide-react";
import { TransferModal } from "./TransferModal";
import { columns } from "../table/InventoryColumns";

export function EmployeeInventoryDashboard({ users = [], currentInventory }) {
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const tableContainerRef = useRef(null);

  // Memoize filtered data
  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId),
    [users, selectedUserId]
  );

  const userInventory = useMemo(
    () => selectedUser?.inventory?.items || [],
    [selectedUser]
  );

  const filteredItems = useMemo(() => {
    if (!searchTerm) return userInventory;
    return userInventory.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [userInventory, searchTerm]);

  const handleCompleteTransfer = async (transferId, action) => {
    try {
      const result = await completeTransfer(transferId, action);
      if (result.success) {
        toast({
          title: `Transfer ${action}ed`,
          description: `Transfer has been ${action}ed successfully`,
        });
        // Refresh data or update state as needed
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Action failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const table = useReactTable({
    data: filteredItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Add this:
    defaultColumn: {
      size: 150, // Default column width
      minSize: 50, // Minimum column width
    },
  });

  // Virtualization setup
  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 48, // Average row height
    getScrollElement: () => tableContainerRef.current,
    overscan: 10,
  });
  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>${selectedUser?.name}'s Inventory</title>
          <style>
            body { font-family: Arial; margin: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>${selectedUser?.name}'s Inventory</h1>
          <p>Generated on ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Batch No.</th>
                <th>Exp. Date</th>
              </tr>
            </thead>
            <tbody>
              ${filteredItems
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${item.batchNumber || "N/A"}</td>
                  <td>${item.expirationDate || "N/A"}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Employee Inventory Management</h1>
        <div className="flex items-center gap-2">
          <Select
            onValueChange={setSelectedUserId}
            value={selectedUserId || ""}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user.name} ({user.role})
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">
            {selectedUser
              ? `${selectedUser.name}'s Inventory`
              : "Select an employee to view inventory"}
          </CardTitle>
          {selectedUser && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTransferOpen(true)}
                disabled={!currentInventory?.items?.length}
              >
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                Transfer Items
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                disabled={!userInventory.length}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Inventory
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {selectedUser ? (
            <>
              <div className="flex items-center py-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search inventory..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="rounded-md border">
                <div
                  className="relative h-[400px] overflow-auto"
                  ref={tableContainerRef}
                >
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead
                              key={header.id}
                              style={{
                                width: header.getSize(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>

                    <TableBody
                      style={{
                        height: `${totalSize}px`,
                        position: "relative",
                      }}
                    >
                      {virtualRows.map((virtualRow) => {
                        const row = rows[virtualRow.index];
                        return (
                          <TableRow
                            key={row.id}
                            data-index={virtualRow.index}
                            ref={rowVirtualizer.measureElement}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              transform: `translateY(${virtualRow.start}px)`,
                            }}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell
                                key={cell.id}
                                style={{
                                  width: cell.column.getSize(), // Match header width
                                }}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              Please select an employee to view their inventory
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {selectedUser && (
            <div className="text-sm text-muted-foreground">
              Showing {filteredItems.length} item
              {filteredItems.length !== 1 ? "s" : ""}
            </div>
          )}
        </CardFooter>
      </Card>

      <TransferModal
        open={isTransferOpen}
        onOpenChange={setIsTransferOpen}
        senderInventory={currentInventory}
        receiver={selectedUser}
        onSuccess={() => {
          setIsTransferOpen(false);
        }}
      />
      {pendingTransfers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingTransfers.map((transfer) => (
                <div
                  key={transfer.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div>
                    <p>
                      {transfer.quantity} x {transfer.product.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      To: {transfer.receiver.name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        handleCompleteTransfer(transfer.id, "accept")
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        handleCompleteTransfer(transfer.id, "reject")
                      }
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// components/inventory/TeamInventoryDashboard.js
"use client";
import { useState, useMemo, useRef } from "react";
import { completeTransfer } from "@/app/(roles)/manager/transfers/_actions/actions";
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

export function TeamInventoryDashboard({ teamMembers = [], managerInventory }) {
  const [selectedTeamMemberId, setSelectedTeamMemberId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const tableContainerRef = useRef(null);

  // Memoize filtered data
  const selectedTeamMember = useMemo(
    () => teamMembers.find((member) => member.id === selectedTeamMemberId),
    [teamMembers, selectedTeamMemberId]
  );

  const teamMemberInventory = useMemo(
    () => selectedTeamMember?.inventory?.items || [],
    [selectedTeamMember]
  );

  const filteredItems = useMemo(() => {
    if (!searchTerm) return teamMemberInventory;
    return teamMemberInventory.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teamMemberInventory, searchTerm]);

  const handleCompleteTransfer = async (transferId, action) => {
    try {
      const result = await completeTransfer(transferId, action);
      if (result.success) {
        toast({
          title: `Transfer ${action}ed`,
          description: `Transfer has been ${action}ed successfully`,
        });
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
    defaultColumn: {
      size: 150,
      minSize: 50,
    },
  });

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 48,
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
          <title>${selectedTeamMember?.name}'s Inventory</title>
          <style>
            body { font-family: Arial; margin: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>${selectedTeamMember?.name}'s Inventory</h1>
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
        <h1 className="text-2xl font-bold">Team Inventory Management</h1>
        <div className="flex items-center gap-2">
          <Select
            onValueChange={setSelectedTeamMemberId}
            value={selectedTeamMemberId || ""}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select team member" />
            </SelectTrigger>
            <SelectContent>
              {teamMembers.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {member.name} ({member.role})
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
            {selectedTeamMember
              ? `${selectedTeamMember.name}'s Inventory`
              : "Select a team member to view inventory"}
          </CardTitle>
          {selectedTeamMember && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTransferOpen(true)}
                disabled={!managerInventory?.items?.length}
              >
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                Transfer Items
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                disabled={!teamMemberInventory.length}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Inventory
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {selectedTeamMember ? (
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
                                  width: cell.column.getSize(),
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
              Please select a team member to view their inventory
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {selectedTeamMember && (
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
        senderInventory={managerInventory}
        receiver={selectedTeamMember}
        onSuccess={() => {
          setIsTransferOpen(false);
        }}
      />
    </div>
  );
}

"use client";
import { useState } from "react";
import { TransferPagination } from "./TransferPagination";
import { TransferDetailsModal } from "./TransferDetailsModal";
import { StatusBadge } from "./StatusBadge";
import { format } from "date-fns";

export function TransferHistoryTable({
  transfers = [],
  totalItems,
  currentPage,
  itemsPerPage,
}) {
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="border rounded-lg overflow-hidden">
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4">
              {transfers.map((transfer) => (
                <div
                  key={transfer.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedTransfer(transfer)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{transfer.product.name}</h3>
                    <StatusBadge status={transfer.status} />
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Quantity:</span>
                      <p>{transfer.quantity}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">From:</span>
                      <p>{transfer.sender.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">To:</span>
                      <p>{transfer.receiver.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <p>
                        {format(new Date(transfer.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <button
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTransfer(transfer);
                    }}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <table className="min-w-full divide-y divide-gray-200 hidden md:table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transfers.map((transfer) => (
                  <tr
                    key={transfer.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedTransfer(transfer)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transfer.product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transfer.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transfer.sender.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transfer.receiver.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(transfer.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={transfer.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTransfer(transfer);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <TransferPagination
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />

      <TransferDetailsModal
        transfer={selectedTransfer}
        open={!!selectedTransfer}
        onOpenChange={(open) => !open && setSelectedTransfer(null)}
      />
    </>
  );
}

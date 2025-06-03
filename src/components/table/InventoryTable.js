// components/table/InventoryTable.js
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PackageSearch } from "lucide-react";

export function InventoryTable({ columns, data }) {
  return (
    <Table className="min-w-full">
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.id}
              className="px-3 py-2 text-left text-xs sm:text-sm font-medium  whitespace-nowrap"
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.length > 0 ? (
          data.map((item) => (
            <TableRow key={`row-${item.id}`} className="hover:bg-gray-50">
              {columns.map((column) => (
                <TableCell
                  key={`cell-${item.id}-${column.id}`}
                  className="px-3 py-2 text-xs sm:text-sm whitespace-nowrap"
                >
                  {column.cell
                    ? column.cell({ row: { original: item } })
                    : column.accessorKey
                    ? item[column.accessorKey]
                    : null}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="px-3 py-6 text-center"
            >
              <div className="flex flex-col items-center justify-center">
                <PackageSearch className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-gray-500">No products found</p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

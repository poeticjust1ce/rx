"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SupplierForm from "./SupplierForm";

export default function EditSupplierModal({ supplier }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Supplier</DialogTitle>
        </DialogHeader>
        <SupplierForm
          supplier={supplier}
          action={async (formData) => {
            "use server";
            await editSupplier(supplier.id, formData);
            setIsOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

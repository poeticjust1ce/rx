// app/(roles)/admin/suppliers/_components/EditSupplierButton.js
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SupplierForm from "./SupplierForm";
import { editSupplier } from "../_actions/actions";

export default function EditSupplierButton({ supplier }) {
  const [isOpen, setIsOpen] = useState(false);

  // This makes the button available to be clicked programmatically
  return (
    <>
      <button
        id={`edit-supplier-${supplier.id}`}
        onClick={() => setIsOpen(true)}
        className="hidden"
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
          </DialogHeader>
          <SupplierForm
            supplier={supplier}
            action={async (formData) => {
              const result = await editSupplier(supplier.id, formData);
              if (result?.success) {
                setIsOpen(false);
                window.location.reload();
              }
              return result;
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PiPlus } from "react-icons/pi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SupplierForm from "./SupplierForm";
import { createSupplier } from "../_actions/actions";

export default function AddSupplierButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleCreate = async (formData) => {
    const result = await createSupplier(formData);
    if (result?.success) {
      setIsOpen(false);
      window.location.reload(); // Refresh to show new data
    }
    return result;
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Add Supplier <PiPlus className="ml-2" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
          </DialogHeader>
          <SupplierForm
            action={handleCreate}
            onSuccess={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

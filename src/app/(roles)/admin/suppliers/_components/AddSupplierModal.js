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

export default function AddSupplierModal() {
  const [isOpen, setIsOpen] = useState(false);

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
            action={async (formData) => {
              "use server";
              await createSupplier(formData);
              setIsOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

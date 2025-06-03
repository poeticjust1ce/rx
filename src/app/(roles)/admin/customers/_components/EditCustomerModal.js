"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CustomerForm from "./CustomerForm";
import { editCustomer } from "../_actions/actions";
import { toast } from "sonner";

export default function EditCustomerModal({ customer }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = async (formData) => {
    try {
      await editCustomer(customer.id, formData);
      setIsOpen(false);
      toast.success("Customer updated successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Error updating customer");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>
        <CustomerForm customer={customer} action={handleEdit} />
      </DialogContent>
    </Dialog>
  );
}

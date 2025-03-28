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
import { toast } from "@/hooks/use-toast";

export default function EditCustomerModal({ customer }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = async (formData) => {
    try {
      await editCustomer(customer.id, formData);
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error updating customer",
        description: error.message,
        variant: "destructive",
      });
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

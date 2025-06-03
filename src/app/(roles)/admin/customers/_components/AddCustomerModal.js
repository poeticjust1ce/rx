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
import CustomerForm from "./CustomerForm";
import { createCustomer } from "../_actions/actions";
import { toast } from "sonner";

export default function AddCustomerModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleCreate = async (formData) => {
    try {
      await createCustomer(formData);
      setIsOpen(false);
      toast.success("Customer added successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Error adding customer");
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Add Customer <PiPlus className="ml-2" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <CustomerForm action={handleCreate} />
        </DialogContent>
      </Dialog>
    </>
  );
}

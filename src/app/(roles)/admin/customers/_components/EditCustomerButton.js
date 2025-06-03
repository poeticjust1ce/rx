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

export default function EditCustomerButton({ customer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        id={`edit-customer-${customer.id}`}
        onClick={() => setIsOpen(true)}
        className="hidden"
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <CustomerForm
            customer={customer}
            action={async (formData) => {
              const result = await editCustomer(customer.id, formData);
              if (result?.success) {
                toast.success("Edited the customer successfully");
                setIsOpen(false);
                window.location.reload();
              } else if (result?.error) {
                toast.error("Error updating customer");
              }
              return result;
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

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

export default function AddCustomerButton() {
  const [isOpen, setIsOpen] = useState(false);

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
          <CustomerForm
            action={async (formData) => {
              const result = await createCustomer(formData);
              if (result?.success) {
                toast.success("Customer added successfully");
                setIsOpen(false);
                window.location.reload();
              } else if (result?.error) {
                toast.error("Can't add customer");
              }
              return result;
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

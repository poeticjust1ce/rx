"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export default function CustomerForm({ customer, action }) {
  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="name">Customer Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter customer name"
          defaultValue={customer?.name}
          required
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          placeholder="Enter customer location"
          defaultValue={customer?.location}
          required
        />
      </div>

      <SubmitButton isEdit={!!customer} />
    </form>
  );
}

function SubmitButton({ isEdit }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full mt-4">
      {pending ? "Processing..." : isEdit ? "Update Customer" : "Add Customer"}
    </Button>
  );
}

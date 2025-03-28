"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { useEffect } from "react";
import { toast } from "sonner";

export default function SupplierForm({ supplier, action }) {
  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="name">Supplier Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter supplier name"
          defaultValue={supplier?.name}
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          placeholder="Enter supplier phone"
          defaultValue={supplier?.phone}
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter supplier email"
          defaultValue={supplier?.email}
        />
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          placeholder="Enter supplier address"
          defaultValue={supplier?.address}
        />
      </div>

      <SubmitButton isEdit={!!supplier} />
    </form>
  );
}

function SubmitButton({ isEdit }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full mt-4">
      {pending ? "Processing..." : isEdit ? "Update Supplier" : "Add Supplier"}
    </Button>
  );
}

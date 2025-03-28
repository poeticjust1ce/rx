// app/(roles)/admin/inventory/_components/ProductForm.js
"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { addProduct, editProduct } from "../_actions/actions";
import { useEffect } from "react";

const ProductForm = ({ suppliers, onSuccess, editData }) => {
  const [error, action] = useActionState(
    editData ? editProduct.bind(null, editData.id) : addProduct,
    {}
  );

  useEffect(() => {
    if (error?.success) {
      onSuccess?.();
    }
  }, [error, onSuccess]);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          defaultValue={editData?.name}
          placeholder="Enter product name"
          name="name"
          id="name"
        />
        {error.name && <p className="text-sm text-destructive">{error.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          defaultValue={editData?.quantity}
          placeholder="Enter quantity"
          name="quantity"
          id="quantity"
          type="number"
          min="1"
        />
        {error.quantity && (
          <p className="text-sm text-destructive">{error.quantity}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Supplier</Label>
        <Select name="supplierId" defaultValue={editData?.supplierId}>
          <SelectTrigger>
            <SelectValue placeholder="Select supplier" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Suppliers</SelectLabel>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {error.supplierId && (
          <p className="text-sm text-destructive">{error.supplierId}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="batchNumber">Batch Number</Label>
        <Input
          defaultValue={editData?.batchNumber}
          placeholder="Enter batch number"
          name="batchNumber"
          id="batchNumber"
        />
        {error.batchNumber && (
          <p className="text-sm text-destructive">{error.batchNumber}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="expirationDate">Expiration Date</Label>
        <Input
          defaultValue={editData?.expirationDate}
          name="expirationDate"
          id="expirationDate"
          type="date"
        />
        {error.expirationDate && (
          <p className="text-sm text-destructive">{error.expirationDate}</p>
        )}
      </div>

      <SubmitButton isEdit={!!editData} />
    </form>
  );
};

function SubmitButton({ isEdit }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full mt-4">
      {pending ? "Processing..." : isEdit ? "Update Product" : "Add Product"}
    </Button>
  );
}

export default ProductForm;

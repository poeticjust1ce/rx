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
import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";

const ProductForm = ({ suppliers, onSuccess, editData }) => {
  const formRef = useRef();
  const isEditMode = Boolean(editData?.id);
  const [error, action] = useActionState(
    isEditMode ? editProduct.bind(null, editData.id) : addProduct,
    {}
  );

  useEffect(() => {
    if (error?.success) {
      formRef.current?.reset();
      onSuccess?.();
    }
  }, [error, onSuccess]);

  return (
    <form ref={formRef} action={action} className="space-y-4 p-4">
      {isEditMode && (
        <div className="pb-2">
          <Badge variant="secondary">Editing: {editData.name}</Badge>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          defaultValue={editData?.name}
          placeholder="Enter product name"
          name="name"
          id="name"
          required
        />
        {error?.name && (
          <p className="text-sm text-destructive">{error.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity *</Label>
        <Input
          defaultValue={editData?.quantity}
          placeholder="Enter quantity"
          name="quantity"
          id="quantity"
          type="number"
          min="1"
          required
        />
        {error?.quantity && (
          <p className="text-sm text-destructive">{error.quantity}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Supplier *</Label>
        <Select name="supplierId" defaultValue={editData?.supplierId} required>
          <SelectTrigger>
            <SelectValue placeholder="Select supplier" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Suppliers</SelectLabel>
              {suppliers?.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {error?.supplierId && (
          <p className="text-sm text-destructive">{error.supplierId}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="batchNumber">Batch Number *</Label>
        <Input
          defaultValue={editData?.batchNumber}
          placeholder="Enter batch number"
          name="batchNumber"
          id="batchNumber"
          required
        />
        {error?.batchNumber && (
          <p className="text-sm text-destructive">{error.batchNumber}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="expirationDate">Expiration Date *</Label>
        <Input
          defaultValue={editData?.expirationDate?.split("T")[0]}
          name="expirationDate"
          id="expirationDate"
          type="date"
          required
        />
        {error?.expirationDate && (
          <p className="text-sm text-destructive">{error.expirationDate}</p>
        )}
      </div>

      <SubmitButton isEdit={isEditMode} />
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

"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { Transfer } from "@/actions/actions";

const TransferProduct = ({
  disabled = true,
  user = { name: "John" },
  inventory,
}) => {
  const [error, action] = useActionState(Transfer, {});

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button disabled={disabled}>Transfer Product</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex justify-center gap-1">
            Transfer product to{" "}
            <p className="font-bold text-primary">{user?.name}</p>
          </DrawerTitle>
        </DrawerHeader>
        <div className="mx-4">
          <form action={action}>
            <div>
              <Input
                className="hidden"
                name="receiverId"
                defaultValue={user?.id}
              />
              <Input
                className="hidden"
                name="senderId"
                defaultValue={inventory?.userId}
              />
            </div>
            <div className="grid gap-2 mb-2">
              <Label htmlFor="productId">Product</Label>
              <Select name="productId" id="productId">
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Products</SelectLabel>

                    {inventory
                      ? inventory?.items?.map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            <Badge variant="secondary">{e.quantity}</Badge>{" "}
                            {e.name}
                          </SelectItem>
                        ))
                      : ""}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {error.productId && (
                <div className="text-destructive">{error.productId}</div>
              )}
            </div>
            <div className="grid gap-2 ">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                placeholder="Enter quantity"
                name="quantity"
                id="quantity"
                type="number"
              />
              {error.error && (
                <div className="text-destructive">{error.error}</div>
              )}
              {error.quantity && (
                <div className="text-destructive">{error.quantity}</div>
              )}
            </div>
            <div>
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                className="resize-none"
                placeholder="If you want to add any remarks"
                name="remarks"
                id="remarks"
              />
              {error.remarks && (
                <div className="text-destructive">{error.remarks}</div>
              )}
            </div>
            <TransferButton />
          </form>
        </div>
        <DrawerFooter>
          <DrawerClose>Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
const TransferButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} type="submit" className="mt-4 w-full">
      {pending ? "Transfering..." : "Transfer"}
    </Button>
  );
};

export default TransferProduct;

"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { transferInventoryItem } from "@/app/(roles)/admin/inventory/_actions/actions";

const transferSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().min(1, "Must transfer at least 1 item"),
  remarks: z.string().optional(),
});

export function TransferModal({
  open,
  onOpenChange,
  senderInventory,
  receiver,
  onSuccess,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      productId: "",
      quantity: 1,
      remarks: "",
    },
  });

  const selectedProductId = form.watch("productId");
  const selectedProduct = senderInventory?.items?.find(
    (item) => item.id === selectedProductId
  );

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      console.log("Attempting transfer:", values);

      const result = await transferInventoryItem({
        productId: values.productId,
        receiverId: receiver.id,
        quantity: values.quantity,
        remarks: values.remarks,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Transfer successful!",
        description: `Transferred ${values.quantity} ${selectedProduct?.name} to ${receiver.name}`,
      });

      onSuccess(); // Close modal and refresh data
    } catch (error) {
      console.error("Transfer error:", error);
      toast({
        title: "Transfer failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Items to {receiver?.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {senderInventory?.items?.map((item) => (
                        <SelectItem
                          key={item.id}
                          value={item.id}
                          disabled={item.quantity <= 0}
                        >
                          {item.name} (Available: {item.quantity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedProduct && (
              <>
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={selectedProduct.quantity}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any notes about this transfer..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Transferring..." : "Confirm Transfer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

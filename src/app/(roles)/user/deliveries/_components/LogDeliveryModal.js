"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createDelivery } from "../_actions/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LogDeliveryModal({ customers, products }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z
    .object({
      customerId: z.string().min(1, "Customer is required"),
      deliveryDate: z.string().min(1, "Date is required"),
      orNumber: z.string().min(1, "OR Number is required"),
      invoiceNumber: z.string().optional(),
      remarks: z.string().optional(),
      items: z
        .array(
          z.object({
            productId: z.string().min(1, "Product is required"),
            quantity: z
              .number({ invalid_type_error: "Quantity is required" })
              .min(1, "Quantity must be at least 1"),
            notes: z.string().optional(),
          })
        )
        .min(1, "At least one item is required"),
    })
    .superRefine((data, ctx) => {
      data.items.forEach((item, index) => {
        const product = products.find((p) => p.id === item.productId);
        if (product && item.quantity > product.quantity) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Quantity exceeds available stock (${product.quantity})`,
            path: ["items", index, "quantity"],
          });
        }
      });
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: "",
      deliveryDate: "",
      orNumber: "",
      invoiceNumber: "",
      remarks: "",
      items: [{ productId: "", quantity: 1, notes: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await createDelivery(data);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Delivery logged successfully");
      setIsOpen(false);
      form.reset();
    } catch (error) {
      toast.error(error.message || "Failed to log delivery");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <ClipboardList className="mr-2 h-4 w-4" />
        Log Delivery
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Log Completed Delivery</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select customer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryDate"
                  render={({ field }) => {
                    const today = new Date().toISOString().split("T")[0];

                    return (
                      <FormItem>
                        <FormLabel>Delivery Date *</FormLabel>
                        <FormControl>
                          <Input type="date" min={today} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="orNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OR Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter OR number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special delivery notes..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Delivered Items *</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({ productId: "", quantity: 1, notes: "" })
                    }
                  >
                    Add Item
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-12 gap-2 items-start"
                  >
                    <div className="col-span-5">
                      <FormLabel>Product *</FormLabel>
                      <FormField
                        control={form.control}
                        name={`items.${index}.productId`}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel>Qty *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage className="min-h-[20px]" />{" "}
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-4">
                      <FormLabel>Item Notes</FormLabel>
                      <FormField
                        control={form.control}
                        name={`items.${index}.notes`}
                        render={({ field }) => (
                          <Input placeholder="Optional notes" {...field} />
                        )}
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Log Delivery
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

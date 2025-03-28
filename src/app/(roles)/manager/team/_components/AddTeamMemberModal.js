// src/app/(roles)/manager/my-team/_components/AddTeamMemberModal.jsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { UserFormFields } from "./UserFormFields";
import { teamMemberSchema } from "./schema";
import { addTeamMember } from "../_actions/actions";

export function AddTeamMemberModal({ children, refresh }) {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "confirmPassword") {
          formData.append(key, value);
        }
      });

      await addTeamMember(formData);
      toast({ title: "Team member added successfully" });
      form.reset();
      if (refresh) await refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Team Member</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <UserFormFields form={form} />
            <Button type="submit">Add Member</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

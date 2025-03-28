// Updated EditTeamMemberModal with form action
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { updateTeamMember } from "../_actions/actions";

export function EditTeamMemberModal({ user, children, refresh }) {
  const { toast } = useToast();

  const handleSubmit = async (formData) => {
    try {
      formData.append("id", user.id);
      await updateTeamMember(formData);
      toast({ title: "Team member updated successfully" });
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
          <DialogTitle>Edit Team Member</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            defaultValue={user.name}
            className="w-full p-2 border rounded"
            required
          />
          <select
            name="role"
            defaultValue={user.role}
            className="w-full p-2 border rounded"
            required
          >
            <option value="user">User</option>
            <option value="manager">Manager</option>
          </select>
          <Button type="submit">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

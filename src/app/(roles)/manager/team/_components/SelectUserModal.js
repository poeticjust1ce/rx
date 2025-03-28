// src/app/(roles)/manager/my-team/_components/SelectUserModal.jsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getAvailableUsers } from "../_actions/actions";
import { assignToTeam } from "../_actions/actions";

export function SelectUserModal({ children, refresh }) {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const availableUsers = await getAvailableUsers();
      setUsers(availableUsers);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedUser) return;

    try {
      await assignToTeam(selectedUser.id);
      toast({ title: "User added to your team successfully" });
      setOpen(false);
      refresh(); // Trigger parent to refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={loadUsers}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add User to Team</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Command>
            <CommandInput placeholder="Search users..." />
            <CommandEmpty>No available users found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={() => setSelectedUser(user)}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selectedUser?.id === user.id ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {user.name} ({user.email})
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
          <Button
            onClick={handleAssign}
            disabled={!selectedUser || loading}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add to Team
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

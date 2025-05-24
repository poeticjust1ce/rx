"use client";

import React from "react";
import { MoreHorizontal, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { deleteUser, toggleStatus, updateRole } from "./actions/actions";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const columns = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback>
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "manager",
    header: "Manager",
    cell: ({ row }) => {
      const manager = row.original.manager;
      return manager ? (
        <span className="text-sm">{manager.name}</span>
      ) : (
        <span className="text-sm text-gray-400">None</span>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const user = row.original;
      const [isUpdating, setIsUpdating] = React.useState(false);

      const handleRoleChange = async (role) => {
        setIsUpdating(true);
        try {
          await updateRole(user.id, role);
          toast({
            title: "Role updated",
            description: `${user.name}'s role has been updated to ${role}`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to update role",
            variant: "destructive",
          });
        } finally {
          setIsUpdating(false);
        }
      };

      return (
        <Select value={user.role} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[120px]">
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="capitalize">{user.role}</span>
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "isActivated",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.isActivated;
      return (
        <Badge variant={isActive ? "default" : "destructive"} className="gap-1">
          {isActive ? (
            <>
              <CheckCircle2 className="h-3 w-3" />
              Active
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3" />
              Inactive
            </>
          )}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const [isDeleting, setIsDeleting] = React.useState(false);
      const [isToggling, setIsToggling] = React.useState(false);

      const handleDelete = async () => {
        setIsDeleting(true);
        try {
          await deleteUser(user.id);
          toast({
            title: "User deleted",
            description: `${user.name} has been removed from the system`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete user",
            variant: "destructive",
          });
        } finally {
          setIsDeleting(false);
        }
      };

      const handleToggleStatus = async () => {
        setIsToggling(true);
        try {
          await toggleStatus(user.id);
          toast({
            title: "Status updated",
            description: `${user.name}'s account has been ${
              user.isActivated ? "deactivated" : "activated"
            }`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to update status",
            variant: "destructive",
          });
        } finally {
          setIsToggling(false);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={handleToggleStatus}
              disabled={isToggling}
            >
              {isToggling ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : user.isActivated ? (
                "Deactivate"
              ) : (
                "Activate"
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

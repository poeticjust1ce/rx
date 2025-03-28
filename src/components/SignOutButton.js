"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function SignOutButton({ className }) {
  return (
    <Button
      variant="ghost"
      className={className}
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Sign Out
    </Button>
  );
}

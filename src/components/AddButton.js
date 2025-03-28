"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AddButton = ({ title, link }) => {
  return (
    <Link href={link}>
      <Button className="gap-2">
        <Plus className="w-4 h-4" />
        {title}
      </Button>
    </Link>
  );
};

export default AddButton;

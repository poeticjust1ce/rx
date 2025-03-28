"use client";

import { PiXBold } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const BackButton = ({ link }) => {
  return (
    <Link href={link}>
      <Button variant="outline">
        <PiXBold size={30} />
      </Button>
    </Link>
  );
};

export default BackButton;

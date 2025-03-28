import { Loader2Icon } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div className="text-2xl animate-spin flex items-center justify-center h-[80vh]">
      <Loader2Icon />
    </div>
  );
};

export default loading;

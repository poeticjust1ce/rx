// src/app/(roles)/manager/attendance/_components/DateRangePicker.jsx
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DateRangePicker() {
  const router = useRouter();
  const [date, setDate] = useState({
    from: undefined,
    to: undefined,
  });

  const handleApply = () => {
    const params = new URLSearchParams();
    if (date?.from) params.set("from", date.from.toISOString());
    if (date?.to) params.set("to", date.to.toISOString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd")} - {format(date.to, "LLL dd")}
                </>
              ) : (
                format(date.from, "LLL dd")
              )
            ) : (
              "Select date range"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <Button onClick={handleApply}>Apply</Button>
      {date?.from && (
        <Button
          variant="ghost"
          onClick={() => {
            setDate({ from: undefined, to: undefined });
            router.push("");
          }}
        >
          Clear
        </Button>
      )}
    </div>
  );
}

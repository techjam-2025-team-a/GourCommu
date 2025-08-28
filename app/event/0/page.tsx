"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";

export default function Event0Page() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div className="flex justify-center items-center h-full">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    </div>
  );
}
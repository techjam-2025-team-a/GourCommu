"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Event0Page() {
  const [selectedDates, setSelectedDates] = React.useState<Date[]>([]);
  const [isClient, setIsClient] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-full pt-20">
                <h2 className="text-xl font-bold tracking-tight select-none">
            予定日を選んでください
          </h2>
          <p className="text-sm text-muted-foreground select-none">
            2つ以上選んで投票を作成する
          </p>
          {isClient ? (
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={setSelectedDates}
              
            />
          ) : null}
      <div className="flex mt-4 space-x-2">
        <Button variant="outline" onClick={() => setSelectedDates([])} className="select-none">
          リセット
        </Button>
        <Button onClick={() => router.push("/event/0/done")} disabled={selectedDates.length < 2} className="select-none">
          決定！
        </Button>
      </div>
    </div>
  );
}
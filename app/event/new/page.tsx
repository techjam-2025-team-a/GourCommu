"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function EventNewPage() {
  const [selectedDates, setSelectedDates] = React.useState<Date[] | undefined>([]);
  const [isClient, setIsClient] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // 「決定！」ボタンが押されたときの処理
  const handleConfirm = () => {
    if (selectedDates && selectedDates.length > 0) {
      // 日付の配列をJSON文字列に変換
      const datesString = JSON.stringify(selectedDates);
      
      // --- ここが修正点です ---
      // 遷移先のURLを /event/new/done に変更
      router.push(`/event/new/done?dates=${encodeURIComponent(datesString)}`);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen pt-20 font-sans bg-orange-50">
      <h2 className="text-xl font-bold tracking-tight select-none text-gray-900">
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
        <Button 
          variant="outline" 
          onClick={() => setSelectedDates([])} 
          className="select-none text-gray-900 bg-[var(--color-calendar-background)] hover:text-[var(--color-calendar-text)]"
        >
          リセット
        </Button>
        <Button 
          onClick={handleConfirm} 
          disabled={!selectedDates || selectedDates.length < 2} 
          className="select-none"
        >
          決定！
        </Button>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { Suspense } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createEvent } from "./actions"; // 作成したサーバーアクションをインポート

// useSearchParams を使うコンポーネントを分離
function EventNewPageComponent() {
  const [selectedDates, setSelectedDates] = React.useState<Date[] | undefined>([]);
  const [isClient, setIsClient] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false); // 送信中フラグ
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // 「決定！」ボタンが押されたときの処理
  const handleConfirm = async () => {
    if (!selectedDates || selectedDates.length < 2) return;

    const storeId = searchParams.get("storeId");
    if (!storeId) {
      toast.error("お店の情報が見つかりません。");
      return;
    }

    setIsSubmitting(true); // 送信中にする

    try {
      // サーバーアクションを呼び出してDBにイベントを保存
      const newEvent = await createEvent({
        storeId: storeId,
        dates: selectedDates,
      });

      // 成功したら、DBから返されたイベントIDを使って次のページへ
      const query = new URLSearchParams({
        dates: JSON.stringify(selectedDates),
        eventId: newEvent.eventId.toString(), // DBのIDを使用
        storeId: storeId,
      });
      
      router.push(`/event/new/done?${query.toString()}`);

    } catch (error) {
      console.error("イベントの作成に失敗しました:", error);
      toast.error("イベントの作成に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false); // 送信完了
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
          disabled={!selectedDates || selectedDates.length < 2 || isSubmitting} 
          className="select-none"
        >
          {isSubmitting ? "作成中..." : "決定！"}
        </Button>
      </div>
    </div>
  );
}

// Suspenseでラップして、useSearchParamsの読み込みを待つ
export default function EventNewPage() {
  return (
    <Suspense>
      <EventNewPageComponent />
    </Suspense>
  );
}

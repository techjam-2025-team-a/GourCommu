"use client";

import * as React from "react";
import { Suspense } from "react"; // Suspenseをインポート
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// 投票の状態を表す型。"〇", "✕" に加えて undefined (未投票) を許容する
type VoteValue = "〇" | "✕" | undefined;

// useSearchParamsを使用する部分をコンポーネントとして切り出します
function VoteSection() {
  const searchParams = useSearchParams();
  const [dates, setDates] = React.useState<string[]>([]);
  const [votes, setVotes] = React.useState<Record<string, VoteValue>>({});
  const [name, setName] = React.useState("");

  // ページが読み込まれた時に、URLから日付データを取得してstateにセットする
  React.useEffect(() => {
    const datesQuery = searchParams.get("dates");
    if (datesQuery) {
      try {
        // URLのクエリパラメータは文字列なので、JSON.parseで配列に戻す
        const parsedDates = JSON.parse(datesQuery);
        if (Array.isArray(parsedDates)) {
          setDates(parsedDates);
        }
      } catch (error) {
        console.error("URLからの日付データの解析に失敗しました:", error);
      }
    }
  }, [searchParams]);

  /**
   * 日付を分かりやすい形式にフォーマットする関数
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", weekday: "short" };
    return new Intl.DateTimeFormat("ja-JP", options).format(date);
  };

  /**
   * 投票ボタンがクリックされたときの処理
   */
  const handleVote = (dateId: string) => {
    const currentVote = votes[dateId];
    let newVoteValue: VoteValue;

    if (currentVote === "〇") {
      newVoteValue = "✕";
    } else if (currentVote === "✕") {
      newVoteValue = undefined;
    } else {
      newVoteValue = "〇";
    }

    setVotes((prevVotes) => ({
      ...prevVotes,
      [dateId]: newVoteValue,
    }));
  };

  const handleSubmit = () => {
    console.log("投票結果:", { name, votes });
    alert("投票が完了しました！ (コンソールに結果が出力されます)");
  };

  // 日付データが読み込まれるまではローディング表示などを出す
  if (dates.length === 0) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-orange-50 font-sans">
            <p>データを読み込んでいます...</p>
        </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-orange-50 font-sans">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-center">出欠を入力してください</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 名前入力欄 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                あなたの名前
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="山田 太郎"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* 日付ごとの投票欄 */}
            <div className="space-y-2">
              {dates.map((dateStr) => (
                <div key={dateStr} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{formatDate(dateStr)}</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleVote(dateStr)}
                      variant={votes[dateStr] ? "default" : "outline"}
                      className={`w-12 h-12 text-2xl rounded-full transition-all duration-200
                        ${votes[dateStr] === "〇" ? "bg-green-500 hover:bg-green-600" : ""}
                        ${votes[dateStr] === "✕" ? "bg-red-500 hover:bg-red-600" : ""}
                      `}
                    >
                      {votes[dateStr] || "?"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* 投票ボタン */}
            <Button onClick={handleSubmit} disabled={!name} className="w-full">
              投票する
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ページ本体
export default function EventVotePage() {
    return (
      // Suspenseでコンポーネントを囲み、fallbackでローディング中の表示を指定します
      <Suspense fallback={<div className="flex justify-center items-center min-h-screen">読み込み中...</div>}>
        <VoteSection />
      </Suspense>
    );
  }


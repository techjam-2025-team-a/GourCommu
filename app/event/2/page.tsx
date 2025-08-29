"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ShareButton } from "@/components/share-button";
// --- ここからが修正点です ---
// お店情報カードで使うコンポーネントをインポート
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Tag, CameraOff, Star, Heart } from "lucide-react";

// --- ここからが修正点です ---
// お店情報の型定義 (app/event/2/page.tsx から拝借)
type Store = {
  id: string; // IDをstringに変更
  name: string;
  location: string;
  tags: string[];
  images: string[];
  likedCount: number;
  savedCount: number;
};

// お店情報のモックデータ (app/event/2/page.tsx から拝借)
// 本来はURLのクエリパラメータなどから取得します
const decidedStore: Store = {
  id: "J001234567", // IDをstringに変更
  name: "琉球ダイニング ちゅらさん亭",
  location: "沖縄県西原町",
  tags: ["沖縄料理", "居酒屋"],
  images: [], // 画像は一旦空にしておきます
  likedCount: 28,
  savedCount: 15,
};

// お店のカードコンポーネント (app/event/2/page.tsx から拝借)
const StoreInfoCard = ({ store }: { store: Store }) => (
  <Card className="border-2 border-gray-200 bg-white shadow-md rounded-xl overflow-hidden mb-6">
    <CardContent className="p-4">
      <div className="flex flex-row space-x-4">
        <div className="w-1/3 flex-shrink-0">
          {store.images && store.images.length > 0 ? (
            <div className="aspect-square bg-gray-200 flex items-center justify-center rounded-lg text-gray-500">
              <span className="text-xs text-gray-400">（お店の画像）</span>
            </div>
          ) : (
            <div className="aspect-square bg-gray-200 flex flex-col items-center justify-center rounded-lg text-gray-400">
              <CameraOff className="h-8 w-8 mb-1" />
              <span className="text-xs">No Image</span>
            </div>
          )}
        </div>
        <div className="w-2/3 flex flex-col">
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              {store.name}
            </h2>
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <MapPin className="h-4 w-4 mr-1.5 text-orange-500" />
              <span>{store.location}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Tag className="h-5 w-5 mr-1 text-orange-500" />
              {store.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mt-auto flex items-center gap-4 pt-4">
              <div className="flex items-center text-gray-600">
                <Star className="h-5 w-5 mr-1 text-yellow-400" /> {store.likedCount}
              </div>
              <div className="flex items-center text-gray-600">
                <Heart className="h-5 w-5 mr-1 text-red-500" /> {store.savedCount}
              </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);


// Mock data for candidate dates (replace with DB fetch later)
const initialCandidateDates = [
  { id: "date1", date: "2025年9月1日 (月)", votesYes: 10, votesNo: 2 },
  { id: "date2", date: "2025年9月2日 (火)", votesYes: 5, votesNo: 7 },
  { id: "date3", date: "2025年9月3日 (水)", votesYes: 15, votesNo: 1 },
  { id: "date4", date: "2025年9月4日 (木)", votesYes: 8, votesNo: 4 },
];

// 投票の状態を表す型
type VoteValue = "〇" | "✕" | undefined;

export default function Event1Page() {
  const router = useRouter();
  const [displayCandidateDates, setDisplayCandidateDates] = useState(initialCandidateDates);
  const [username, setUsername] = useState("");
  const [votes, setVotes] = useState<{ [key: string]: VoteValue }>({});
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  const handleVoteChange = (dateId: string, value: "〇" | "✕") => {
    const previousVote = votes[dateId];
    const newVoteValue: VoteValue = previousVote === value ? undefined : value;

    setVotes((prevVotes) => ({
      ...prevVotes,
      [dateId]: newVoteValue,
    }));

    setDisplayCandidateDates((prevDates) =>
      prevDates.map((date) => {
        if (date.id === dateId) {
          const newDate = { ...date };
          if (previousVote === "〇") newDate.votesYes--;
          else if (previousVote === "✕") newDate.votesNo--;
          if (newVoteValue === "〇") newDate.votesYes++;
          else if (newVoteValue === "✕") newDate.votesNo++;
          return newDate;
        }
        return date;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/event/1/done");
  };

  return (
    <div className="min-h-screen font-sans bg-orange-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            日付投票
          </h1>

          {/* --- ここからが修正点です --- */}
          {/* お店情報カードを配置 */}
          <StoreInfoCard store={decidedStore} />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-gray-800">
                お名前
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="お名前を入力してください"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                候補日への投票
              </h2>
              {displayCandidateDates.map((date) => (
                <div
                  key={date.id}
                  className="flex items-center justify-between p-3 border rounded-md bg-gray-50"
                >
                  <span className="font-medium text-gray-800">{date.date}</span>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={votes[date.id] === "〇" ? "default" : "outline"}
                      onClick={() => handleVoteChange(date.id, "〇")}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-md ${votes[date.id] === "〇"
                          ? "bg-orange-500 text-white"
                          : "bg-white text-gray-800 border border-gray-300"
                        }`}
                    >
                      <span>〇</span>
                      <span className="text-gray-500 text-xs">({date.votesYes})</span>
                    </Button>
                    <Button
                      type="button"
                      variant={votes[date.id] === "✕" ? "default" : "outline"}
                      onClick={() => handleVoteChange(date.id, "✕")}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-md ${votes[date.id] === "✕"
                          ? "bg-orange-500 text-white"
                          : "bg-white text-gray-800 border border-gray-300"
                        }`}
                    >
                      <span>✕</span>
                      <span className="text-gray-500 text-xs">({date.votesNo})</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold">
              投票を送信
            </Button>
          </form>
        </div>

        <div className="flex justify-end mt-4">
          <ShareButton url={shareUrl} tooltipTitle="投票ページを共有" />
        </div>
      </div>
    </div>
  );
}

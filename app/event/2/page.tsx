"use client";

import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Tag,
  CameraOff,
  Star,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";

// `spot-list/page.tsx` から型定義を拝借
type Store = {
  id: number;
  name: string;
  location: string;
  tags: string[];
  images: string[];
  likedCount: number;
  savedCount: number;
};

// `spot-list/page.tsx` からモックデータを拝借（1件に絞る）
const decidedStore: Store = {
  id: 1,
  name: "琉球ダイニング ちゅらさん亭",
  location: "沖縄県西原町",
  tags: ["沖縄料理", "居酒屋"],
  images: ["/placeholder1.jpg"],
  likedCount: 28,
  savedCount: 15,
};

// 投票結果のモックデータ
const voteResults = [
    { date: "2025年9月1日 (月)", votes: 15 },
    { date: "2025年9月2日 (火)", votes: 8 },
    { date: "2025年9月3日 (水)", votes: 3 },
];

// お店のカードコンポーネント (`spot-list/page.tsx` の SpotCard を簡略化)
const StoreInfoCard = ({ store }: { store: Store }) => (
  <Card className="border-2 border-gray-300 bg-white shadow-lg rounded-xl overflow-hidden mb-6">
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
            <h2 className="text-xl font-bold text-gray-800 mb-1">
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

// 投票結果を表示するコンポーネント
const VoteResultDisplay = ({ results }: { results: { date: string, votes: number }[] }) => (
    <Card className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">投票結果</h3>
        <ul className="space-y-3">
            {results.sort((a, b) => b.votes - a.votes).map((result, index) => (
                <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span className="font-medium text-gray-700">{result.date}</span>
                    <span className="font-bold text-orange-600">{result.votes} 票</span>
                </li>
            ))}
        </ul>
    </Card>
);


export default function Event2Page() {
  const decidedDate = "2025年9月1日 (月)";

  return (
    <div className="min-h-screen font-sans bg-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-4">
          開催日が決まりました！
        </h1>
        <p className="text-center text-xl text-orange-600 font-bold mb-8">
          {decidedDate}
        </p>

        <StoreInfoCard store={decidedStore} />

        <VoteResultDisplay results={voteResults} />

        <div className="text-center mt-10">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                イベントページに戻る
            </Button>
        </div>
      </div>
    </div>
  );
}
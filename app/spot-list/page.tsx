"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Tag,
  Users,
  CreditCard,
  Utensils,
  Star,
  Heart,
  CameraOff,
} from "lucide-react";

// --- 型定義とモックデータ ---
type Store = {
  id: number;
  name: string;
  location: string;
  tags: string[];
  images: string[];
  isCardOk: boolean;
  category: "和食" | "洋食" | "中華";
  maxPeople: number;
  isHighlyRated: boolean;
  isInterested: boolean;
  likedCount: number; // 「良かった」のカウント
  savedCount: number; // 「気になる」のカウント
};

// 初期データ
const initialStoresData: Store[] = [
  {
    id: 1,
    name: "琉球ダイニング ちゅらさん亭",
    location: "沖縄県西原町",
    tags: ["沖縄料理", "居酒屋"],
    images: ["/placeholder1.jpg"],
    isCardOk: true,
    category: "和食",
    maxPeople: 4,
    isHighlyRated: true,
    isInterested: true,
    likedCount: 28,
    savedCount: 15,
  },
  {
    id: 2,
    name: "ビストロ・デ・マール",
    location: "沖縄県那覇市",
    tags: ["フレンチ", "ワイン"],
    images: ["/placeholder2.jpg"],
    isCardOk: true,
    category: "洋食",
    maxPeople: 2,
    isHighlyRated: false,
    isInterested: true,
    likedCount: 12,
    savedCount: 23,
  },
  {
    id: 3,
    name: "中華飯店 龍の髭",
    location: "沖縄県浦添市",
    tags: ["中華", "餃子"],
    images: ["/placeholder3.jpg"],
    isCardOk: false,
    category: "中華",
    maxPeople: 6,
    isHighlyRated: true,
    isInterested: true,
    likedCount: 45,
    savedCount: 8,
  },
];

const filterOptions = [
  {
    id: "isHighlyRated",
    label: "よかった",
    icon: <Star className="mr-1.5 h-4 w-4" />,
  },
  {
    id: "isInterested",
    label: "きになる",
    icon: <Heart className="mr-1.5 h-4 w-4" />,
  },
  {
    id: "isCardOk",
    label: "カード可",
    icon: <CreditCard className="mr-1.5 h-4 w-4" />,
  },
  {
    id: "isJapaneseFood",
    label: "和食",
    icon: <Utensils className="mr-1.5 h-4 w-4" />,
  },
  {
    id: "isForSmallGroup",
    label: "〜3人",
    icon: <Users className="mr-1.5 h-4 w-4" />,
  },
];

// --- お店情報のカードコンポーネント ---
const SpotCard = ({
  store,
  onCountUp,
  onSelectStore,
}: {
  store: Store;
  onCountUp: (id: number, type: "like" | "save") => void;
}) => (
  <Card className="border-2 border-orange-200 bg-white shadow-lg rounded-xl overflow-hidden mb-3">
    <CardContent className="p-3">
      <div className="flex flex-row space-x-4">
        {/* 画像コンテナ */}
        <div className="w-1/3 flex-shrink-0">
          {store.images && store.images.length > 0 ? (
            <Carousel>
              <CarouselContent>
                {store.images.map((_, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square bg-gray-200 flex items-center justify-center rounded-lg text-gray-500">
                      <span className="text-xs text-gray-400">
                        （お店の画像 {index + 1}）
                      </span>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {store.images.length > 1 && (
                <>
                  <CarouselPrevious className="left-2 hidden sm:flex" />
                  <CarouselNext className="right-2 hidden sm:flex" />
                </>
              )}
            </Carousel>
          ) : (
            <div className="aspect-square bg-gray-200 flex flex-col items-center justify-center rounded-lg text-gray-400">
              <CameraOff className="h-8 w-8 mb-1" />
              <span className="text-xs">No Image</span>
            </div>
          )}
        </div>
        {/* 店舗情報コンテナ */}
        <div className="w-2/3 flex flex-col">
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-0.5">
              {store.name}
            </h2>
            <div className="flex items-center text-xs text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1.5 text-orange-500" />
              <span>{store.location}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Tag className="h-5 w-5 mr-1 text-orange-500" />
              {store.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-2 flex-grow flex flex-col justify-end space-y-2">
            <Button
              size="sm"
              variant="link"
              asChild // このプロパティを追加
              className="p-0 justify-start h-auto" // レイアウト用のクラスのみ残す
            >
              <a className="text-orange-500 hover:text-orange-600 hover:underline underline-offset-4">
                この店の詳細をみる
              </a>
            </Button>

            <Button
              size="sm"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold"
              onClick={() => onSelectStore(store.id)}
            >
              このお店にする
            </Button>
            <div className="flex flex-wrap gap-2">
              <StyledActionButton onClick={() => onCountUp(store.id, "like")}>
                <Star className="h-4 w-4 mr-1" /> {store.likedCount}
              </StyledActionButton>
              <StyledActionButton onClick={() => onCountUp(store.id, "save")}>
                <Heart className="h-4 w-4 mr-1" /> {store.savedCount}
              </StyledActionButton>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const StyledActionButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const defaultStyle = {
    backgroundColor: "transparent",
    color: "#f97316",
    borderColor: "#f97316",
    borderWidth: "1px",
  };
  const hoverStyle = {
    backgroundColor: "#f97316",
    color: "white",
    borderColor: "#f97316",
    borderWidth: "1px",
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={isHovered ? hoverStyle : defaultStyle}
    >
      {children}
    </Button>
  );
};

const FilterButton = ({
  filter,
  isSelected,
  onClick,
}: {
  filter: { id: string; label: string; icon: React.ReactNode };
  isSelected: boolean;
  onClick: () => void;
}) => {
  // フックをコンポーネントのトップレベルで呼び出す
  const [isHovered, setIsHovered] = useState(false);

  const defaultStyle = {
    backgroundColor: "transparent",
    color: "#f97316",
    borderColor: "#f97316",
    borderWidth: "1px",
  };
  const selectedStyle = {
    backgroundColor: "#f97316",
    color: "white",
    borderColor: "#f97316",
    borderWidth: "1px",
  };
  const hoverStyle = isSelected ? defaultStyle : selectedStyle;

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={isHovered ? hoverStyle : isSelected ? selectedStyle : defaultStyle}
    >
      {filter.icon}
      {filter.label}
    </Button>
  );
};

// --- ページ全体 ---
const SpotListPage = () => {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>(initialStoresData);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleSelectStore = (storeId: number) => {
    router.push(`/event/0?storeId=${storeId}`);
  };

  const handleFilterToggle = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId],
    );
  };

  const handleCountUp = (id: number, type: "like" | "save") => {
    setStores((prevStores) =>
      prevStores.map((store) => {
        if (store.id === id) {
          if (type === "like")
            return { ...store, likedCount: store.likedCount + 1 };
          if (type === "save")
            return { ...store, savedCount: store.savedCount + 1 };
        }
        return store;
      }),
    );
  };

  const filteredStores = stores.filter((store) => {
    return activeFilters.every((filterId) => {
      if (filterId === "isHighlyRated") return store.isHighlyRated;
      if (filterId === "isCardOk") return store.isCardOk;
      if (filterId === "isJapaneseFood") return store.category === "和食";
      if (filterId === "isForSmallGroup") return store.maxPeople <= 3;
      return true;
    });
  });

  return (
    <main className="font-sans bg-orange-50">
      <div className="w-full max-w-4xl mx-auto px-4 pt-6 pb-4">
        <div className="sticky top-11 z-3 bg-orange-50/80 pt-6 pb-4 backdrop-blur-sm border-b border-orange-100">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">お店を探す</h1>
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center space-x-2 whitespace-nowrap">
              {filterOptions.map((filter) => (
                <FilterButton
                  key={filter.id}
                  filter={filter}
                  isSelected={activeFilters.includes(filter.id)}
                  onClick={() => handleFilterToggle(filter.id)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="pt-6">
            {filteredStores.length > 0 ? (
              filteredStores.map((store) => (
                <SpotCard
                  key={store.id}
                  store={store}
                  onCountUp={handleCountUp}
                  onSelectStore={handleSelectStore}
                />
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p>条件に合うお店が見つかりませんでした。</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default SpotListPage;

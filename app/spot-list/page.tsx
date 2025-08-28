"use client";

import { useState, useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Shop } from "@/types"; // 正しいShop型をインポート

// --- コンポーネント内で使用するデータの型定義 ---
type Store = {
  id: string; // IDをstring型に変更
  name: string;
  location: string;
  tags: string[];
  images: string[];
  isCardOk: boolean;
  category: "和食" | "洋食" | "中華" | "その他";
  maxPeople: number;
  isHighlyRated: boolean;
  isInterested: boolean;
  likedCount: number;
  savedCount: number;
};

// --- APIから店舗情報を取得する関数 ---
async function fetchShops(keyword?: string): Promise<Shop[]> {
  const query = new URLSearchParams();
  // 現在地に近い西原町や那覇市などをキーワードに設定
  query.set("keyword", keyword || "沖縄 西原 那覇");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/shops?${query.toString()}`,
    );
    if (!res.ok) {
      console.error(`Failed to fetch shops: ${res.status} ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    return data.results?.shop ?? [];
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Fetch error:", errorMessage);
    return [];
  }
}

// --- APIデータ(Shop)をコンポーネント用のデータ(Store)に変換する関数 ---
const mapShopToStore = (shop: Shop): Store => {
  const tags = [shop.genre.name, shop.catch].filter(Boolean);

  let category: Store["category"] = "その他";
  if (
    tags.some(
      (t) => t.includes("和食") || t.includes("居酒屋") || t.includes("寿司"),
    )
  ) {
    category = "和食";
  } else if (
    tags.some(
      (t) =>
        t.includes("洋食") ||
        t.includes("イタリアン") ||
        t.includes("フレンチ"),
    )
  ) {
    category = "洋食";
  } else if (tags.some((t) => t.includes("中華"))) {
    category = "中華";
  }

  return {
    id: shop.id,
    name: shop.name,
    location: shop.address,
    tags: tags.slice(0, 3),
    images: [shop.photo.pc.l, shop.photo.pc.m, shop.photo.pc.s].filter(Boolean),
    isCardOk: shop.card === "利用可",
    category: category,
    maxPeople: shop.party_capacity || Math.floor(Math.random() * 6) + 2,
    isHighlyRated: Math.random() > 0.5,
    isInterested: Math.random() > 0.3,
    likedCount: Math.floor(Math.random() * 50),
    savedCount: Math.floor(Math.random() * 30),
  };
};

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
  onCountUp: (id: string, type: "like" | "save") => void;
  onSelectStore: (id: string) => void;
}) => (
  <Card className="border-2 border-orange-200 bg-white shadow-lg rounded-xl overflow-hidden mb-3">
    <CardContent className="p-3">
      <div className="flex flex-row space-x-4">
        {/* 画像コンテナ */}
        <div className="w-1/3 flex-shrink-0">
          {store.images && store.images.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {store.images.map((imgSrc, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={`${store.name}の画像 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
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
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag className="h-5 w-5 mr-1 text-orange-500" />
              {store.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-auto flex flex-col justify-end space-y-2 pt-2">
            <Button
              size="sm"
              variant="link"
              asChild
              className="p-0 justify-start h-auto"
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

// --- ローディング中のスケルトンコンポーネント ---
const SpotCardSkeleton = () => (
  <div className="flex space-x-4 p-3 border-2 border-gray-200 bg-white shadow-lg rounded-xl mb-3">
    <Skeleton className="h-32 w-1/3 rounded-lg" />
    <div className="w-2/3 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex space-x-2">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="flex-grow" />
      <div className="flex justify-between items-center pt-4">
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  </div>
);

// --- ページ全体 ---
const SpotListPage = () => {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api/shops`,
        );
        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }

        // APIから受け取ったデータ（お店の配列）をそのまま使う
        const fetchedShops: Shop[] = await response.json();

        // 画面表示用にデータを変換
        const mappedStores = fetchedShops.map(mapShopToStore);

        // Stateを更新して画面に反映
        setStores(mappedStores);
      } catch (error) {
        console.error("データ処理中にエラーが発生しました:", error);
        setStores([]); // エラーが発生した場合は空にする
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSelectStore = (storeId: string) => {
    router.push(`/event/0?storeId=${storeId}`);
  };

  const handleFilterToggle = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId],
    );
  };

  const handleCountUp = (id: string, type: "like" | "save") => {
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
    if (activeFilters.length === 0) {
      return true;
    }
    return activeFilters.every((filterId) => {
      if (filterId === "isHighlyRated") return store.isHighlyRated;
      if (filterId === "isInterested") return store.isInterested;
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
            {isLoading ? (
              <div>
                <SpotCardSkeleton />
                <SpotCardSkeleton />
                <SpotCardSkeleton />
              </div>
            ) : filteredStores.length > 0 ? (
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

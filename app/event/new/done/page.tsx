"use client";
import { Input } from "@/components/ui/input";
import { ShareButton } from "@/components/share-button";
// useRefをreactからインポートします
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

export default function Event0DonePage() {
  const [shareUrl, setShareUrl] = useState("");
  // 処理が実行済みかを管理するためのrefを作成します
  const effectRan = useRef(false);

  useEffect(() => {
    // ストリクトモードによる2回実行を防ぐためのチェックを追加します
    if (effectRan.current === false) {
      // このeffectはクライアントサイドでのみ実行されます
      if (typeof window !== "undefined") {
        // 現在のURLから、ドメイン部分とクエリパラメータを取得します
        const origin = window.location.origin; //例: "https://gourcommu-omega.vercel.app"
        const searchParams = window.location.search; //例: "?dates=..."

        // 正しい共有用URLを組み立てます
        const newShareUrl = `${origin}/event/1${searchParams}`;
        
        setShareUrl(newShareUrl);

        // ページ読み込み時に自動でクリップボードにコピーして通知します
        if (newShareUrl) {
          navigator.clipboard.writeText(newShareUrl).then(() => {
            // コピー成功時にsonnerで通知
            toast("共有URLをコピーしました！", {
              description: "URLがクリップボードに自動でコピーされました。",
            });
          }).catch(err => {
            // 自動コピーに失敗した場合はコンソールにエラーを出力
            console.error("URLの自動コピーに失敗しました:", err);
          });
        }
      }

      // 処理が実行されたことを記録します
      return () => {
        effectRan.current = true;
      };
    }
  }, []); // このuseEffectは初回レンダリング時に一度だけ実行されます

  return (
    <div className="flex flex-col justify-center items-center h-screen pt-20 font-sans bg-orange-50">
      <h1 className="text-2xl font-bold mb-4">開催日の投票を作成しました！</h1>
      <p className="text-sm text-muted-foreground mb-4">
        リンクをクリップボードにコピーしました。「貼り付け」や「共有」をしてください。
      </p>
      <div className="flex w-full max-w-sm items-center space-x-2 mx-auto">
        <Input type="text" value={shareUrl} readOnly className="bg-white" />
        <ShareButton url={shareUrl} />
      </div>
    </div>
  );
}

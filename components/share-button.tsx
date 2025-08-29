// components/share-button.tsx
"use client";

import * as React from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner"; // Using sonner for toasts

interface ShareButtonProps {
  url: string;
  title?: string; // 共有シートに表示されるタイトル
  text?: string;  // 共有シートに表示されるテキスト
  tooltipTitle?: string;
  copiedTooltipTitle?: string;
}

export function ShareButton({
  url,
  title = typeof document !== "undefined" ? document.title : "", // デフォルトは現在のページのタイトル
  text = "", // オプションのテキスト
  tooltipTitle = "共有",
  copiedTooltipTitle = "コピーしました！",
}: ShareButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => {
        setHasCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasCopied]);

  const handleShare = async () => {
    // 1. まずクリップボードにコピーして、sonnerで通知を出す
    try {
      await navigator.clipboard.writeText(url);
      setHasCopied(true);
      toast("リンクをコピーしました！", {
        description: "共有可能なリンクがクリップボードにコピーされました。",
      });
    } catch (error) {
      console.error("コピーに失敗しました:", error);
      toast("コピーに失敗しました", {
        description: "リンクをクリップボードにコピーできませんでした。",
      });
      // コピーに失敗した場合は、ここで処理を中断
      return;
    }

    // 2. 次に、Web Share APIが利用可能であれば呼び出す
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: url,
        });
      } catch (error) {
        // ユーザーが共有をキャンセルした場合などは、エラーを無視します
        // (すでにクリップボードへのコピーは成功しているため)
        console.log("Web Share APIはキャンセルされたか、利用できませんでした。", error);
      }
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* --- ここからが修正点です --- */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
            aria-label={hasCopied ? copiedTooltipTitle : tooltipTitle}
            className="rounded-full bg-white border-gray-300 hover:bg-gray-100 text-gray-600"
          >
            {hasCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{hasCopied ? copiedTooltipTitle : tooltipTitle}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

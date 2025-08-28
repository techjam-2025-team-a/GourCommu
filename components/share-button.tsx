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
    if (navigator.share) {
      // Web Share API がサポートされている場合
      try {
        await navigator.share({
          title: title,
          text: text,
          url: url,
        });
        
      } catch (error) {
        console.error("Web Share APIでの共有に失敗しました", error);
        // Fallback to clipboard copy if Web Share API fails or is cancelled
        try {
          await navigator.clipboard.writeText(url);
          setHasCopied(true);
          toast("リンクをコピーしました！", {
            description: "共有可能なリンクがクリップボードにコピーされました。",
          });
          
        } catch (clipboardError) {
          console.error("クリップボードへのコピーに失敗しました:", clipboardError);
          toast("コピーに失敗しました", {
            description: "リンクをクリップボードにコピーできませんでした。",
          });
          
        }
      }
    } else {
      // Web Share API がサポートされていない場合、クリップボードにコピー
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
      }
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            aria-label={hasCopied ? copiedTooltipTitle : tooltipTitle}
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

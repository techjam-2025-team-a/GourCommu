"use client"
import { Input } from "@/components/ui/input";
import { ShareButton } from "@/components/share-button";
import { useEffect, useState } from "react";

export default function Event0DonePage() {
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen pt-20 font-sans bg-orange-50">
      <h1 className="text-2xl font-bold mb-4">開催日の投票を作成しました！</h1>
      <div className="flex w-full max-w-sm items-center space-x-2 mx-auto">
        <Input type="text" value={shareUrl} readOnly />
        <ShareButton url={shareUrl} />
      </div>
    </div>
  );
}

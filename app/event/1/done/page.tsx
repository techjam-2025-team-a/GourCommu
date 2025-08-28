"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Event1DonePage() {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="min-h-screen font-sans bg-orange-50 flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        投票ありがとうございます！
      </h1>
      
      <Button
        onClick={() => setIsLiked(!isLiked)}
        size="lg"
        className="bg-white hover:bg-gray-100 text-gray-800 shadow-md rounded-full w-24 h-24 flex items-center justify-center"
      >
        <Heart
          className={`w-12 h-12 transition-all duration-300 ${
            isLiked ? "text-red-500 fill-current" : "text-gray-400"
          }`}
        />
      </Button>
    </div>
  );
}
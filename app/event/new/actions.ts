"use server";

// schema.prismaのoutput設定に合わせて、生成された場所から直接インポートします
import { PrismaClient } from "../../../lib/generated/prisma";

// PrismaClientのインスタンスを作成
const prisma = new PrismaClient();

// イベントを作成するためのデータ型を定義
interface CreateEventData {
  storeId: string | null; // storeIdがnullの可能性を許容
  dates: Date[];
}

export async function createEvent(data: CreateEventData) {
  // --- ここからが修正点です ---
  const { dates } = data;
  let storeId = data.storeId;

  // ローカルテスト用：storeIdがURLにない場合、テスト用のIDを強制的に使う
  // メンバーがDBにテスト用の店舗データを1つ入れてくれると、そのIDを使えます
  if (!storeId) {
    console.warn("storeIdがURLにないため、テスト用のID (1) を使用します。");
    storeId = "1"; // ここに存在するテスト用の店舗IDを入れる
  }
  
  // URLから受け取ったstoreId(文字列)を、DBで必要な数値(Int)に変換
  const storeIdInt = parseInt(storeId, 10);
  if (isNaN(storeIdInt)) {
    throw new Error("無効な店舗IDです。");
  }

  try {
    // データベースに新しいイベントと、それに紐づく候補日を作成
    const newEvent = await prisma.event.create({
      data: {
        // どの店舗のイベントか
        spot: {
          connect: { spotId: storeIdInt },
        },
        // 候補日はどれか
        dates: {
          create: dates.map(date => ({
            date: date,
          })),
        },
      },
    });

    return newEvent;

  } catch (error) {
    console.error("Prisma Error:", error);
    throw new Error("イベントのデータベースへの保存に失敗しました。");
  }
}

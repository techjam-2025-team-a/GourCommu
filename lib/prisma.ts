import { PrismaClient } from "./generated/prisma";

// 開発環境でのホットリロード時にPrismaClientのインスタンスが増え続けないようにするための対策
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;

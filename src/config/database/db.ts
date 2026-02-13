import { PrismaClient } from "@prisma/client";
import { prismaAdapter } from "./prisma-adapter";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma: PrismaClient =
  globalThis.prisma ||
  new PrismaClient({
    adapter: prismaAdapter,
    log: ["error", "warn"]
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export { prisma };

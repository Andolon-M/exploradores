import { defineConfig, env } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    seed: "dotenv -e .env -- ts-node seeders/seed.ts"
  },
  datasource: {
    url: env("DATABASE_URL")
  }
});

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const databaseUrl =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  "postgresql://postgres:postgres@127.0.0.1:5432/app_db";

if (process.env.NODE_ENV !== "production") {
  const source = process.env.DATABASE_URL
    ? "DATABASE_URL"
    : process.env.POSTGRES_URL
      ? "POSTGRES_URL"
      : process.env.POSTGRES_PRISMA_URL
        ? "POSTGRES_PRISMA_URL"
        : "local fallback";
  console.log(`[db] using connection source: ${source}`);
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes("neon.tech")
      ? { rejectUnauthorized: false }
      : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool, { schema });

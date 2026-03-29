/**
 * Merchant Admin — Database Layer
 * Connects to the SAME maham_expo database as Admin Backend.
 * Uses tRPC proxy to Admin Backend for most operations.
 */

import { drizzle } from "drizzle-orm/mysql2";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Merchant Admin DB] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// Proxy to Admin Backend API for shared data
const ADMIN_API = process.env.ADMIN_API_URL || "https://admin.mahamexpo.sa/api/trpc";

export async function fetchFromAdmin(procedure: string, input?: any) {
  try {
    const url = `${ADMIN_API}/${procedure}`;
    const response = await fetch(url, {
      method: input ? "POST" : "GET",
      headers: { "Content-Type": "application/json" },
      body: input ? JSON.stringify(input) : undefined,
    });
    const data = await response.json();
    return data.result?.data ?? data;
  } catch (error) {
    console.error(`[Admin API] Failed: ${procedure}`, error);
    return null;
  }
}

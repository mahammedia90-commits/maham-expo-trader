/**
 * Merchant Admin — API Routes
 * Proxies to Admin Backend for shared data operations.
 * Handles merchant-specific dashboard and analytics locally.
 */

import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { getDb, fetchFromAdmin } from "./db";

const t = initTRPC.create();
const publicProcedure = t.procedure;

export const appRouter = t.router({
  // Dashboard
  dashboard: publicProcedure.query(async () => {
    const stats = await fetchFromAdmin("merchant-dash.getStats");
    return stats || { totalBookings: 0, activeContracts: 0, pendingPayments: 0, revenue: 0 };
  }),

  // Bookings (proxy to admin)
  bookings: t.router({
    list: publicProcedure.query(async () => {
      return await fetchFromAdmin("bookings-full.list") || [];
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await fetchFromAdmin("bookings-full.getById", input);
    }),
  }),

  // Contracts (proxy to admin)
  contracts: t.router({
    list: publicProcedure.query(async () => {
      return await fetchFromAdmin("contracts-full.list") || [];
    }),
  }),

  // Payments (proxy to admin)
  payments: t.router({
    list: publicProcedure.query(async () => {
      return await fetchFromAdmin("tap-payments.list") || [];
    }),
  }),

  // Profile
  profile: t.router({
    get: publicProcedure.query(async () => {
      return await fetchFromAdmin("auth-core.me");
    }),
  }),
});

export type AppRouter = typeof appRouter;

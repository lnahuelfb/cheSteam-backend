import { Response } from "express";

// Cache-Control policies for the Vercel edge cache (s-maxage) with
// stale-while-revalidate so visitors almost never wait on a cold function.
export const CACHE_POLICIES = {
  // Steam prices change rarely; serve for 1 h, stale for up to 24 h.
  games: "public, s-maxage=3600, stale-while-revalidate=86400",
  // Exchange rates move during the day; revalidate every 5 min.
  dolar: "public, s-maxage=300, stale-while-revalidate=3600",
  // Static values defined in code; they only change on deploy.
  taxes: "public, s-maxage=86400, stale-while-revalidate=86400",
} as const;

export const setCache = (res: Response, policy: keyof typeof CACHE_POLICIES) => {
  res.set("Cache-Control", CACHE_POLICIES[policy]);
};

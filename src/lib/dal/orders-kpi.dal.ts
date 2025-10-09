import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { ORDER_STATUS } from "@/lib/constants/stripe-constants";

export type Granularity = "month" | "week" | "day";

export type RevenueSeriesPoint = {
  periodStart: string; // ISO date at start of bucket
  total: number;
};

export class OrdersKpiDAL {
  constructor(private supabase: SupabaseClient<Database>) {}

  // Sum of revenue for a creator, optional currency and date range filters
  async getTotalRevenue(
    creatorId: string,
    opts?: { currency?: string; from?: string; to?: string }
  ): Promise<number> {
    const { currency, from, to } = opts || {};

    let query = this.supabase
      .from("orders")
      .select(
        `total_amount, currency, created_at, course:course_id(creator_id)`,
        { count: "exact" }
      )
      .eq("status", ORDER_STATUS.SUCCEEDED)
      .eq("course.creator_id", creatorId);

    if (currency) query = query.eq("currency", currency);
    if (from) query = query.gte("created_at", from);
    if (to) query = query.lte("created_at", to);

    const { data, error } = await query;
    if (error) {
      throw new Error(`Error fetching total revenue: ${error.message}`);
    }

    const total = (data ?? []).reduce((sum, o: any) => sum + Number(o.total_amount || 0), 0);
    return Number(total.toFixed(2));
  }

  // Current month revenue (MRR-like), filtered to the month of now()
  async getCurrentMonthRevenue(
    creatorId: string,
    opts?: { currency?: string }
  ): Promise<number> {
    const monthStart = this.startOfMonthISO(new Date());
    const monthEnd = this.endOfMonthISO(new Date());
    return this.getTotalRevenue(creatorId, {
      currency: opts?.currency,
      from: monthStart,
      to: monthEnd,
    });
  }

  // Revenue series over time aggregated on the client.
  async getRevenueSeries(
    creatorId: string,
    opts?: {
      granularity?: Granularity; // default month
      periodMonths?: number; // default 12 (used if from/to not given)
      currency?: string;
      from?: string; // ISO
      to?: string; // ISO
    }
  ): Promise<RevenueSeriesPoint[]> {
    const granularity: Granularity = opts?.granularity || "month";

    // Decide range
    let fromISO = opts?.from;
    let toISO = opts?.to;
    if (!fromISO || !toISO) {
      const months = Math.max(1, opts?.periodMonths ?? 12);
      const now = new Date();
      const from = new Date(now);
      from.setMonth(from.getMonth() - (months - 1));
      fromISO = this.startOfBucketISO(from, granularity);
      toISO = this.endOfBucketISO(now, granularity);
    }

    // Fetch raw orders and aggregate in-memory
    let query = this.supabase
      .from("orders")
      .select(
        `total_amount, currency, created_at, course:course_id(creator_id)`,
        { count: "exact" }
      )
      .eq("status", ORDER_STATUS.SUCCEEDED)
      .eq("course.creator_id", creatorId)
      .gte("created_at", fromISO!)
      .lte("created_at", toISO!);

    if (opts?.currency) query = query.eq("currency", opts.currency);

    const { data, error } = await query;
    if (error) {
      throw new Error(`Error fetching revenue series: ${error.message}`);
    }

    const buckets = this.buildEmptyBuckets(fromISO!, toISO!, granularity);

    for (const row of data ?? []) {
      const createdAt = new Date(row.created_at as string);
      const key = this.bucketKey(createdAt, granularity);
      if (key in buckets) {
        buckets[key] += Number(row.total_amount || 0);
      }
    }

    // Format ordered series
    const series: RevenueSeriesPoint[] = Object.keys(buckets)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((k) => ({ periodStart: k, total: Number(buckets[k].toFixed(2)) }));

    return series;
  }

  // Helpers
  private startOfMonthISO(d: Date): string {
    const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0, 0));
    return x.toISOString();
  }
  private endOfMonthISO(d: Date): string {
    const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0, 23, 59, 59, 999));
    return x.toISOString();
  }

  private startOfWeekISO(d: Date): string {
    // ISO week starts Monday; normalize to UTC
    const day = (d.getUTCDay() + 6) % 7; // 0=Mon..6=Sun
    const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
    start.setUTCDate(start.getUTCDate() - day);
    return start.toISOString();
  }

  private endOfWeekISO(d: Date): string {
    const day = (d.getUTCDay() + 6) % 7;
    const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
    end.setUTCDate(end.getUTCDate() + (6 - day));
    return end.toISOString();
  }

  private startOfDayISO(d: Date): string {
    const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
    return x.toISOString();
  }
  private endOfDayISO(d: Date): string {
    const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
    return x.toISOString();
  }

  private startOfBucketISO(d: Date, g: Granularity): string {
    if (g === "month") return this.startOfMonthISO(d);
    if (g === "week") return this.startOfWeekISO(d);
    return this.startOfDayISO(d);
  }
  private endOfBucketISO(d: Date, g: Granularity): string {
    if (g === "month") return this.endOfMonthISO(d);
    if (g === "week") return this.endOfWeekISO(d);
    return this.endOfDayISO(d);
  }

  private bucketKey(d: Date, g: Granularity): string {
    if (g === "month") return this.startOfMonthISO(d);
    if (g === "week") return this.startOfWeekISO(d);
    return this.startOfDayISO(d);
  }

  private buildEmptyBuckets(fromISO: string, toISO: string, g: Granularity): Record<string, number> {
    const buckets: Record<string, number> = {};
    const start = new Date(fromISO);
    const end = new Date(toISO);

    const cursor = new Date(start);
    while (cursor <= end) {
      const key = this.bucketKey(cursor, g);
      buckets[key] = 0;
      // advance cursor
      if (g === "month") {
        cursor.setUTCMonth(cursor.getUTCMonth() + 1);
      } else if (g === "week") {
        cursor.setUTCDate(cursor.getUTCDate() + 7);
      } else {
        cursor.setUTCDate(cursor.getUTCDate() + 1);
      }
    }
    return buckets;
  }
}

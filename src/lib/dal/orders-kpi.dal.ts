import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { ORDER_STATUS } from "@/lib/constants/stripe-constants";

export type Granularity = "month" | "week" | "day";

// Raw revenue sample for charting on client
export type RevenueSample = {
  created_at: string; // ISO timestamp of order creation (UTC)
  total_amount: number;
  currency: string;
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

  // Revenue grouped by course for a creator
  async getRevenueByCourse(
    creatorId: string,
    opts?: { currency?: string; from?: string; to?: string; limit?: number }
  ): Promise<{ courseId: string; name: string; total: number; currency?: string }[]> {
    const { currency, from, to, limit = 10 } = opts || {};

    let query = this.supabase
      .from("orders")
      .select(
        `total_amount, currency, created_at, course:course_id(id, name, creator_id)`,
        { count: "exact" }
      )
      .eq("status", ORDER_STATUS.SUCCEEDED)
      .eq("course.creator_id", creatorId);

    if (currency) query = query.eq("currency", currency);
    if (from) query = query.gte("created_at", from);
    if (to) query = query.lte("created_at", to);

    const { data, error } = await query;
    if (error) {
      throw new Error(`Error fetching revenue by course: ${error.message}`);
    }

    // Aggregate in-memory
    const map = new Map<string, { courseId: string; name: string; total: number; currency?: string }>();
    for (const row of data ?? []) {
      const course = (row as any).course as { id: string; name: string } | null;
      if (!course?.id) continue;
      const key = course.id;
      const prev = map.get(key) || { courseId: course.id, name: course.name, total: 0, currency: currency || (row as any).currency };
      prev.total += Number((row as any).total_amount || 0);
      // If mixed currencies and no filter, omit currency for safety (keep undefined)
      if (!currency) {
        prev.currency = undefined;
      }
      map.set(key, prev);
    }

    const result = Array.from(map.values())
      .map((r) => ({ ...r, total: Number(r.total.toFixed(2)) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, Math.max(1, limit));

    return result;
  }

  // Students per course (count of successful orders) for a creator
  async getStudentsByCourse(
    creatorId: string,
    opts?: { from?: string; to?: string; limit?: number }
  ): Promise<{ courseId: string; name: string; count: number }[]> {
    const { from, to, limit = 10 } = opts || {};

    let query = this.supabase
      .from("orders")
      .select(
        `id, created_at, course:course_id(id, name, creator_id)`,
        { count: "exact" }
      )
      .eq("status", ORDER_STATUS.SUCCEEDED)
      .eq("course.creator_id", creatorId);

    if (from) query = query.gte("created_at", from);
    if (to) query = query.lte("created_at", to);

    const { data, error } = await query;
    if (error) {
      throw new Error(`Error fetching students by course: ${error.message}`);
    }

    const map = new Map<string, { courseId: string; name: string; count: number }>();
    for (const row of data ?? []) {
      const course = (row as any).course as { id: string; name: string } | null;
      if (!course?.id) continue;
      const key = course.id;
      const prev = map.get(key) || { courseId: course.id, name: course.name, count: 0 };
      prev.count += 1; // each successful order counts as one enrollment
      map.set(key, prev);
    }

    const result = Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, Math.max(1, limit));

    return result;
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
      // period filter: 7 days, 30 days, 1 year, or all-time when null/undefined
      period?: "7d" | "30d" | "1y" | null;
      currency?: string;
    }
  ): Promise<RevenueSample[]> {
    // Compute optional time range based on period
    const now = new Date();
    let fromISO: string | undefined;
    let toISO: string | undefined;

    const period = opts?.period ?? null;
    if (period === "7d" || period === "30d") {
      const days = period === "7d" ? 6 : 29;
      const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
      const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
      start.setUTCDate(start.getUTCDate() - days);
      fromISO = start.toISOString();
      toISO = end.toISOString();
    } else if (period === "1y") {
      const startMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
      startMonth.setUTCMonth(startMonth.getUTCMonth() - 11);
      const endMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));
      fromISO = startMonth.toISOString();
      toISO = endMonth.toISOString();
    } else {
      // all-time: no date filter
      fromISO = undefined;
      toISO = undefined;
    }

    // Fetch raw orders within computed range
    let query = this.supabase
      .from("orders")
      .select(
        `total_amount, currency, created_at, course:course_id(creator_id)`,
        { count: "exact" }
      )
      .eq("status", ORDER_STATUS.SUCCEEDED)
      .eq("course.creator_id", creatorId);

    if (opts?.currency) query = query.eq("currency", opts.currency);
    if (fromISO) query = query.gte("created_at", fromISO);
    if (toISO) query = query.lte("created_at", toISO);

    const { data, error } = await query;
    if (error) {
      throw new Error(`Error fetching revenue series: ${error.message}`);
    }

    const series: RevenueSample[] = (data ?? []).map((row: any) => ({
      created_at: row.created_at as string,
      total_amount: Number(row.total_amount || 0),
      currency: (row.currency || "USD") as string,
    }));

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

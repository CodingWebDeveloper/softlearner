import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { ORDER_STATUS } from "@/lib/constants/stripe-constants";
import {
  resolveNetAmount,
  getPeriodDateRange,
  startOfMonthISO,
  endOfMonthISO,
  aggregateRevenueByCourse,
  aggregateStudentsByCourse,
  RevenueByCourseEntry,
} from "@/lib/utils/kpi.utils";

export type Granularity = "month" | "week" | "day";

export type RevenueSample = {
  created_at: string;
  total_amount: number;
  net_amount?: number;
  currency: string;
};

export class OrdersKpiDAL {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getTotalRevenue(
    creatorId: string,
    opts?: { currency?: string; from?: string; to?: string },
  ): Promise<number> {
    const { currency, from, to } = opts || {};

    let query = this.supabase
      .from("orders")
      .select(
        `total_amount, net_amount, platform_fee_amount, currency, created_at, course:course_id(creator_id)`,
        { count: "exact" },
      )
      .eq("status", ORDER_STATUS.SUCCEEDED)
      .eq("course.creator_id", creatorId);

    if (currency) query = query.eq("currency", currency);
    if (from) query = query.gte("created_at", from);
    if (to) query = query.lte("created_at", to);

    const { data, error } = await query;
    if (error)
      throw new Error(`Error fetching total revenue: ${error.message}`);

    const total = (data ?? []).reduce(
      (sum, o: any) => sum + resolveNetAmount(o),
      0,
    );
    return Number(total.toFixed(2));
  }

  async getRevenueByCourse(
    creatorId: string,
    opts?: { currency?: string; from?: string; to?: string; limit?: number },
  ): Promise<RevenueByCourseEntry[]> {
    const { currency, from, to, limit = 10 } = opts || {};

    let query = this.supabase
      .from("orders")
      .select(
        `total_amount, net_amount, platform_fee_amount, currency, created_at, course:course_id(id, name, creator_id)`,
        { count: "exact" },
      )
      .eq("status", ORDER_STATUS.SUCCEEDED)
      .eq("course.creator_id", creatorId);

    if (currency) query = query.eq("currency", currency);
    if (from) query = query.gte("created_at", from);
    if (to) query = query.lte("created_at", to);

    const { data, error } = await query;
    if (error)
      throw new Error(`Error fetching revenue by course: ${error.message}`);

    return aggregateRevenueByCourse(data ?? [], currency, limit);
  }

  async getStudentsByCourse(
    creatorId: string,
    opts?: { from?: string; to?: string; limit?: number },
  ): Promise<{ courseId: string; name: string; count: number }[]> {
    const { from, to, limit = 10 } = opts || {};

    let query = this.supabase
      .from("orders")
      .select(`id, created_at, course:course_id(id, name, creator_id)`, {
        count: "exact",
      })
      .eq("status", ORDER_STATUS.SUCCEEDED)
      .eq("course.creator_id", creatorId);

    if (from) query = query.gte("created_at", from);
    if (to) query = query.lte("created_at", to);

    const { data, error } = await query;
    if (error)
      throw new Error(`Error fetching students by course: ${error.message}`);

    return aggregateStudentsByCourse(data ?? [], limit);
  }

  async getCurrentMonthRevenue(
    creatorId: string,
    opts?: { currency?: string },
  ): Promise<number> {
    const now = new Date();
    return this.getTotalRevenue(creatorId, {
      currency: opts?.currency,
      from: startOfMonthISO(now),
      to: endOfMonthISO(now),
    });
  }

  async getRevenueSeries(
    creatorId: string,
    opts?: { period?: "7d" | "30d" | "1y" | null; currency?: string },
  ): Promise<RevenueSample[]> {
    const { from: fromISO, to: toISO } = getPeriodDateRange(opts?.period);

    let query = this.supabase
      .from("orders")
      .select(
        `total_amount, net_amount, platform_fee_amount, currency, created_at, course:course_id(creator_id)`,
        { count: "exact" },
      )
      .eq("status", ORDER_STATUS.SUCCEEDED)
      .eq("course.creator_id", creatorId);

    if (opts?.currency) query = query.eq("currency", opts.currency);
    if (fromISO) query = query.gte("created_at", fromISO);
    if (toISO) query = query.lte("created_at", toISO);

    const { data, error } = await query;
    if (error)
      throw new Error(`Error fetching revenue series: ${error.message}`);

    return (data ?? []).map((row: any) => ({
      created_at: row.created_at as string,
      total_amount: Number(row.total_amount || 0),
      net_amount: resolveNetAmount(row),
      currency: (row.currency || "USD") as string,
    }));
  }
}

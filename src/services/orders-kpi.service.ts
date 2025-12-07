import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database/database.types";
import { OrdersKpiDAL } from "@/lib/dal/orders-kpi.dal";
import {
  IOrdersKpiService,
  OrdersRevenueSample,
  TopEarningCourse,
  StudentsPerCourseItem,
} from "./interfaces/service.interfaces";

export class OrdersKpiService implements IOrdersKpiService {
  private dal: OrdersKpiDAL;

  constructor(supabase: SupabaseClient<Database>) {
    this.dal = new OrdersKpiDAL(supabase);
  }

  async getTotalRevenue(
    creatorId: string,
    opts?: { currency?: string; from?: string; to?: string }
  ): Promise<number> {
    return this.dal.getTotalRevenue(creatorId, opts);
  }

  async getCurrentMonthRevenue(
    creatorId: string,
    opts?: { currency?: string }
  ): Promise<number> {
    return this.dal.getCurrentMonthRevenue(creatorId, opts);
  }

  async getRevenueSeries(
    creatorId: string,
    opts?: {
      period?: "7d" | "30d" | "1y" | null;
      currency?: string;
    }
  ): Promise<OrdersRevenueSample[]> {
    // Pass through to DAL with new period-based options
    return this.dal.getRevenueSeries(creatorId, {
      period: opts?.period ?? null,
      currency: opts?.currency,
    });
  }

  async getRevenueByCourse(
    creatorId: string,
    opts?: { currency?: string; from?: string; to?: string; limit?: number }
  ): Promise<TopEarningCourse[]> {
    return this.dal.getRevenueByCourse(creatorId, opts);
  }

  async getStudentsByCourse(
    creatorId: string,
    opts?: { from?: string; to?: string; limit?: number }
  ): Promise<StudentsPerCourseItem[]> {
    return this.dal.getStudentsByCourse(creatorId, opts);
  }
}

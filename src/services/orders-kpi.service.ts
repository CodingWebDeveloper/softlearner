import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database/database.types";
import { OrdersKpiDAL } from "@/lib/dal/orders-kpi.dal";
import {
  IOrdersKpiService,
  OrdersKpiGranularity,
  OrdersRevenueSeriesPoint,
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
      granularity?: OrdersKpiGranularity;
      periodMonths?: number;
      currency?: string;
      from?: string;
      to?: string;
    }
  ): Promise<OrdersRevenueSeriesPoint[]> {
    // Map interface types to DAL's accepted types (identical strings)
    return this.dal.getRevenueSeries(creatorId, {
      granularity: opts?.granularity as any,
      periodMonths: opts?.periodMonths,
      currency: opts?.currency,
      from: opts?.from,
      to: opts?.to,
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

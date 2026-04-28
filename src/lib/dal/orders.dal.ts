import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { IOrdersDAL, SimpleOrder } from "../di/interfaces/dal.interfaces";
import { ORDER_STATUS } from "@/lib/constants/stripe-constants";

type OrderFinancialRow = {
  total_amount: number | null;
  net_amount: number | null;
  platform_fee_amount: number | null;
  currency: string | null;
  created_at: string;
  updated_at: string;
};

export class OrdersDAL implements IOrdersDAL {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getOrdersByCourseId(courseId: string): Promise<SimpleOrder[]> {
    const { data, error } = await this.supabase
      .from("orders")
      .select(
        "total_amount, net_amount, platform_fee_amount, currency, created_at, updated_at, status",
      )
      .eq("course_id", courseId)
      .eq("status", ORDER_STATUS.SUCCEEDED)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }

    const rows = (data ?? []) as OrderFinancialRow[];

    return rows.map((o) => {
      const totalAmount = Number(o.total_amount ?? 0);
      const platformFeeAmount = Number(o.platform_fee_amount ?? 0);

      return {
        total_amount: totalAmount,
        net_amount: Number(o.net_amount ?? totalAmount - platformFeeAmount),
        platform_fee_amount: platformFeeAmount,
        currency: o.currency ?? "USD",
        created_at: o.created_at,
        updated_at: o.updated_at,
      };
    });
  }
}

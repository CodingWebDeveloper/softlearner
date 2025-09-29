import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { IOrdersDAL, SimpleOrder } from "../di/interfaces/dal.interfaces";
import { ORDER_STATUS } from "@/lib/constants/stripe-constants";

export class OrdersDAL implements IOrdersDAL {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getOrdersByCourseId(courseId: string): Promise<SimpleOrder[]> {
    const { data, error } = await this.supabase
      .from("orders")
      .select("total_amount, currency, created_at, updated_at, status")
      .eq("course_id", courseId)
      .eq("status", ORDER_STATUS.SUCCEEDED)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }

    return (data || []).map((o) => ({
      total_amount: Number((o as any).total_amount ?? 0),
      currency: (o as any).currency as string,
      created_at: (o as any).created_at as string,
      updated_at: (o as any).updated_at as string,
    }));
  }
}

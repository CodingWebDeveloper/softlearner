import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { IOrdersDAL } from "../di/interfaces/dal.interfaces";

export class OrdersDAL implements IOrdersDAL {
  constructor(private supabase: SupabaseClient<Database>) {}
  // Methods will be added as needed
}

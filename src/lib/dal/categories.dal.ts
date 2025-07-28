import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { ICategoriesDAL } from "../di/interfaces/dal.interfaces";
import { Category } from "../database/database.types";

export class CategoriesDAL implements ICategoriesDAL {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getCategories(): Promise<Category[]> {
    const { data: categories, error } = await this.supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      throw new Error(`Error fetching categories: ${error.message}`);
    }

    return categories;
  }
}

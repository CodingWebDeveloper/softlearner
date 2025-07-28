import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { IUsersDAL } from "../di/interfaces/dal.interfaces";
import { UserDetails } from "@/services/interfaces/service.interfaces";

type UserRow = Database["public"]["Tables"]["users"]["Row"];

export class UsersDAL implements IUsersDAL {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getUserDetails(userId: string): Promise<UserDetails | null> {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error(`Error fetching user details: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const user = data as UserRow;

    const userDetails: UserDetails = {
      id: user.id,
      full_name: user.full_name || "",
      avatar_url: user.avatar_url || "",
      username: user.username || "",
      bio: user.bio || "",
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return userDetails;
  }

  async getUserDetailsByUsername(
    username: string
  ): Promise<UserDetails | null> {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error) {
      throw new Error(
        `Error fetching user details by username: ${error.message}`
      );
    }

    if (!data) {
      return null;
    }

    const user = data as UserRow;

    const userDetails: UserDetails = {
      id: user.id,
      full_name: user.full_name || "",
      avatar_url: user.avatar_url || "",
      username: user.username || "",
      bio: user.bio || "",
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return userDetails;
  }
}

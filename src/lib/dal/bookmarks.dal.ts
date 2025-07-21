import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { IBookmarksDAL } from "../di/interfaces/dal.interfaces";
import { Bookmark } from "@/services/interfaces/service.interfaces";
import { DATABASE_ERROR_CODES } from "@/constants/database-constants";
import {
  BOOKMARK_ERRORS,
  DATABASE_TABLES,
} from "@/constants/bookmarks-constants";

export class BookmarksDAL implements IBookmarksDAL {
  constructor(private supabase: SupabaseClient<Database>) {}

  async createBookmark(userId: string, courseId: string): Promise<Bookmark> {
    const { data, error } = await this.supabase
      .from(DATABASE_TABLES.BOOKMARKS)
      .insert({
        user_id: userId,
        course_id: courseId,
      })
      .select()
      .single();

    if (error) {
      if (error.code === DATABASE_ERROR_CODES.UNIQUE_VIOLATION) {
        throw new Error(BOOKMARK_ERRORS.ALREADY_EXISTS);
      }
      throw new Error(`${BOOKMARK_ERRORS.CREATE_FAILED}: ${error.message}`);
    }

    return data;
  }

  async deleteBookmark(userId: string, courseId: string): Promise<void> {
    const { error } = await this.supabase
      .from(DATABASE_TABLES.BOOKMARKS)
      .delete()
      .eq("user_id", userId)
      .eq("course_id", courseId);

    if (error) {
      throw new Error(`${BOOKMARK_ERRORS.DELETE_FAILED}: ${error.message}`);
    }
  }
}

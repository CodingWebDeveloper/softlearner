import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database/database.types";
import { PaginatedResult } from "@/lib/di/interfaces/dal.interfaces";
import { CreatorRecentReview } from "@/services/interfaces/service.interfaces";

export type PageParams = { page?: number; pageSize?: number };

export class ReviewsKpiDAL {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getCreatorRecentReviews(
    creatorId: string,
    { page = 1, pageSize = 10 }: PageParams = {}
  ): Promise<PaginatedResult<CreatorRecentReview>> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const query = this.supabase
      .from("reviews")
      .select(
        `
        id,
        content,
        rating,
        created_at,
        updated_at,
        course_id,
        course:course_id(id, name, creator_id),
        user:user_id(
          id,
          full_name,
          avatar_url,
          created_at,
          updated_at
        )
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false });

    // Filter by creator via join alias
    const { data, count, error } = await query.eq("course.creator_id", creatorId).range(from, to);

    if (error) {
      throw new Error(`Error fetching recent reviews: ${error.message}`);
    }

    const items: CreatorRecentReview[] = (data || []).map((r: any) => ({
      id: r.id,
      content: r.content,
      rating: r.rating,
      created_at: r.created_at,
      updated_at: r.updated_at ?? null,
      course_name: r.course?.name,
      user: {
        id: r.user?.id ?? "",
        email: r.user?.email ?? null,
        full_name: r.user?.full_name ?? null,
        avatar_url: r.user?.avatar_url ?? null,
        created_at: r.user?.created_at ?? "",
        updated_at: r.user?.updated_at ?? "",
      },
    }));

    return { data: items, totalRecords: count || 0 };
  }

  async getCreatorAverageRating(creatorId: string): Promise<number | null> {
    const { data, error } = await this.supabase
      .from("reviews")
      .select(
        `
        rating,
        course:course_id(creator_id)
      `
      )
      .eq("course.creator_id", creatorId);

    if (error) {
      throw new Error(`Error fetching average rating: ${error.message}`);
    }

    const ratings = (data || []).map((r: any) => Number(r.rating)).filter((n) => !isNaN(n));
    if (ratings.length === 0) return null;
    const avg = ratings.reduce((sum, n) => sum + n, 0) / ratings.length;
    return avg;
  }
}

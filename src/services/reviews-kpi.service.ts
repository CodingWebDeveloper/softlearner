import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database/database.types";
import { ReviewsKpiDAL } from "@/lib/dal/reviews-kpi.dal";
import { CreatorRecentReview, IReviewsKpiService, PaginatedResult } from "./interfaces/service.interfaces";

export class ReviewsKpiService implements IReviewsKpiService {
  private dal: ReviewsKpiDAL;

  constructor(supabase: SupabaseClient<Database>) {
    this.dal = new ReviewsKpiDAL(supabase);
  }

  async getCreatorRecentReviews(
    creatorId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResult<CreatorRecentReview>> {
    return this.dal.getCreatorRecentReviews(creatorId, { page, pageSize });
  }

  async getCreatorAverageRating(creatorId: string): Promise<number | null> {
    return this.dal.getCreatorAverageRating(creatorId);
  }
}

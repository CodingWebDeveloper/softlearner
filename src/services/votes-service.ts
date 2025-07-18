import { createClient } from "@/lib/supabase/server";
import {
  Vote,
  VoteType,
  ReviewWithVotes,
} from "./interfaces/service.interfaces";

export class VotesService {
  async upsertVote(
    userId: string,
    reviewId: string,
    voteType: VoteType
  ): Promise<Vote | null> {
    const supabase = await createClient();

    const { data: existingVote } = await supabase
      .from("review_votes")
      .select()
      .eq("user_id", userId)
      .eq("review_id", reviewId)
      .single();

    if (existingVote) {
      // If the vote type is the same, delete the vote (toggle off)
      if (existingVote.vote_type === voteType) {
        const { error } = await supabase
          .from("review_votes")
          .delete()
          .eq("id", existingVote.id);

        if (error) throw error;
        return null;
      }

      // If vote type is different, update the vote
      const { data, error } = await supabase
        .from("review_votes")
        .update({ vote_type: voteType })
        .eq("id", existingVote.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    // Create new vote
    const { data, error } = await supabase
      .from("review_votes")
      .insert({
        user_id: userId,
        review_id: reviewId,
        vote_type: voteType,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getReviewVotes(
    reviewId: string,
    userId?: string
  ): Promise<ReviewWithVotes> {
    const supabase = await createClient();

    // Get vote counts
    const { data: voteCounts, error: countsError } = await supabase
      .from("review_vote_counts")
      .select("*")
      .eq("review_id", reviewId)
      .single();

    if (countsError && countsError.code !== "PGRST116") throw countsError;

    // Get user's vote if userId is provided
    let userVote: VoteType | undefined;
    if (userId) {
      const { data: vote, error: voteError } = await supabase
        .from("review_votes")
        .select("vote_type")
        .eq("review_id", reviewId)
        .eq("user_id", userId)
        .single();

      if (voteError && voteError.code !== "PGRST116") throw voteError;
      userVote = vote?.vote_type;
    }

    return {
      id: reviewId,
      vote_counts: {
        upvotes: voteCounts?.upvotes ?? 0,
        downvotes: voteCounts?.downvotes ?? 0,
      },
      user_vote: userVote,
    };
  }
}

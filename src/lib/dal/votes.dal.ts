import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { IVotesDAL } from "../di/interfaces/dal.interfaces";
import {
  Vote,
  VoteType,
  ReviewWithVotes,
} from "@/services/interfaces/service.interfaces";

export class VotesDAL implements IVotesDAL {
  constructor(private supabase: SupabaseClient<Database>) {}

  async upsertVote(
    userId: string,
    reviewId: string,
    voteType: VoteType
  ): Promise<Vote | null> {
    const { data: existingVote } = await this.supabase
      .from("review_votes")
      .select()
      .eq("user_id", userId)
      .eq("review_id", reviewId)
      .single();

    if (existingVote) {
      // If the vote type is the same, delete the vote (toggle off)
      if (existingVote.vote_type === voteType) {
        const { error } = await this.supabase
          .from("review_votes")
          .delete()
          .eq("id", existingVote.id);

        if (error) {
          throw new Error(`Error deleting vote: ${error.message}`);
        }
        return null;
      }

      // If vote type is different, update the vote
      const { data, error } = await this.supabase
        .from("review_votes")
        .update({ 
          vote_type: voteType,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingVote.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating vote: ${error.message}`);
      }
      return data;
    }

    // Create new vote
    const { data, error } = await this.supabase
      .from("review_votes")
      .insert({
        user_id: userId,
        review_id: reviewId,
        vote_type: voteType,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating vote: ${error.message}`);
    }
    return data;
  }

  async getReviewVotes(
    reviewId: string,
    userId?: string
  ): Promise<ReviewWithVotes> {
    // Get vote counts
    const { data: voteCounts, error: countsError } = await this.supabase
      .from("review_vote_counts")
      .select("*")
      .eq("review_id", reviewId)
      .single();

    if (countsError && countsError.code !== "PGRST116") {
      throw new Error(`Error fetching vote counts: ${countsError.message}`);
    }

    // Get user's vote if userId is provided
    let userVote: VoteType | undefined;
    if (userId) {
      const { data: vote, error: voteError } = await this.supabase
        .from("review_votes")
        .select("vote_type")
        .eq("review_id", reviewId)
        .eq("user_id", userId)
        .single();

      if (voteError && voteError.code !== "PGRST116") {
        throw new Error(`Error fetching user vote: ${voteError.message}`);
      }
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

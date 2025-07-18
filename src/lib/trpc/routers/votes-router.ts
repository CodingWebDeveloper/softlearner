import { z } from "zod";
import { VotesService, VoteType } from "../../../services/votes-service";
import { router, procedure } from "../server";

const upsertVoteInput = z.object({
  reviewId: z.string(),
  voteType: z.enum(["Up", "Down"]),
});

const getReviewVotesInput = z.object({
  reviewId: z.string(),
});

const votesService = new VotesService();

export const votesRouter = router({
  upsertVote: procedure
    .input(upsertVoteInput)
    .mutation(async ({ input, ctx }) => {
      try {
        if (!ctx.user?.id) {
          throw new Error("User must be authenticated to vote");
        }

        const vote = await votesService.upsertVote(
          ctx.user.id,
          input.reviewId,
          input.voteType as VoteType
        );
        return vote;
      } catch (error) {
        throw new Error(
          `Failed to update vote: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getReviewVotes: procedure
    .input(getReviewVotesInput)
    .query(async ({ input, ctx }) => {
      try {
        const votes = await votesService.getReviewVotes(
          input.reviewId,
          ctx.user?.id
        );
        return votes;
      } catch (error) {
        throw new Error(
          `Failed to fetch votes: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
});

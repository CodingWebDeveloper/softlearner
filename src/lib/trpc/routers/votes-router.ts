import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { IVotesService } from "@/services/interfaces/service.interfaces";
import { DI_TOKENS } from "@/lib/di/registry";

const upsertVoteInput = z.object({
  reviewId: z.string(),
  voteType: z.enum(["Up", "Down"]),
});

const getReviewVotesInput = z.object({
  reviewId: z.string(),
});

export const votesRouter = router({
  upsertVote: protectedProcedure
    .input(upsertVoteInput)
    .mutation(async ({ input, ctx }) => {
      try {
        const votesService = ctx.container.resolve<IVotesService>(
          DI_TOKENS.VOTES_SERVICE
        );

        return await votesService.upsertVote(
          ctx.user.id,
          input.reviewId,
          input.voteType
        );
      } catch (error) {
        throw new Error(
          `Failed to update vote: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getReviewVotes: protectedProcedure
    .input(getReviewVotesInput)
    .query(async ({ input, ctx }) => {
      try {
        const votesService = ctx.container.resolve<IVotesService>(
          DI_TOKENS.VOTES_SERVICE
        );

        return await votesService.getReviewVotes(input.reviewId, ctx.user?.id);
      } catch (error) {
        throw new Error(
          `Failed to fetch votes: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
});

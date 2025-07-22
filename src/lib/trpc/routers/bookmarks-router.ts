import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { IBookmarksService } from "@/services/interfaces/service.interfaces";
import { DI_TOKENS } from "@/lib/di/registry";

const bookmarkInput = z.object({
  courseId: z.string(),
});

export const bookmarksRouter = router({
  createBookmark: protectedProcedure
    .input(bookmarkInput)
    .mutation(async ({ input, ctx }) => {
      try {
        const bookmarksService = ctx.container.resolve<IBookmarksService>(
          DI_TOKENS.BOOKMARKS_SERVICE
        );

        return await bookmarksService.createBookmark(
          ctx.user.id,
          input.courseId
        );
      } catch (error) {
        throw new Error(
          `Failed to create bookmark: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  deleteBookmark: protectedProcedure
    .input(bookmarkInput)
    .mutation(async ({ input, ctx }) => {
      try {
        const bookmarksService = ctx.container.resolve<IBookmarksService>(
          DI_TOKENS.BOOKMARKS_SERVICE
        );

        await bookmarksService.deleteBookmark(ctx.user.id, input.courseId);
      } catch (error) {
        throw new Error(
          `Failed to delete bookmark: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
});

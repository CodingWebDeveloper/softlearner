import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { ITagsService } from "@/services/interfaces/service.interfaces";
import { DI_TOKENS } from "@/lib/di/registry";

const getTagsInput = z.object({
  search: z.string().optional(),
  limit: z.number().min(1).max(100).optional(),
});

const getTagsByCourseIdInput = z.object({
  courseId: z.string().min(1),
});

const createTagInput = z.object({
  name: z.string().min(1).max(50),
});

const updateTagInput = z.object({
  id: z.string(),
  name: z.string().min(1).max(50),
});

const deleteTagInput = z.object({
  id: z.string(),
});

export const tagsRouter = router({
  getTags: protectedProcedure
    .input(getTagsInput.optional())
    .query(async ({ ctx, input }) => {
      try {
        const tagsService = ctx.container.resolve<ITagsService>(
          DI_TOKENS.TAGS_SERVICE
        );
        return await tagsService.getTags(input);
      } catch (error) {
        throw new Error(
          `Failed to fetch tags: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getTagsByCourseId: protectedProcedure
    .input(getTagsByCourseIdInput)
    .query(async ({ ctx, input }) => {
      try {
        const tagsService = ctx.container.resolve<ITagsService>(
          DI_TOKENS.TAGS_SERVICE
        );
        return await tagsService.getTagsByCourseId(input.courseId);
      } catch (error) {
        throw new Error(
          `Failed to fetch course tags: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  createTag: protectedProcedure
    .input(createTagInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const tagsService = ctx.container.resolve<ITagsService>(
          DI_TOKENS.TAGS_SERVICE
        );
        return await tagsService.createTag(input.name);
      } catch (error) {
        throw new Error(
          `Failed to create tag: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  updateTag: protectedProcedure
    .input(updateTagInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const tagsService = ctx.container.resolve<ITagsService>(
          DI_TOKENS.TAGS_SERVICE
        );
        return await tagsService.updateTag(input.id, input.name);
      } catch (error) {
        throw new Error(
          `Failed to update tag: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  deleteTag: protectedProcedure
    .input(deleteTagInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const tagsService = ctx.container.resolve<ITagsService>(
          DI_TOKENS.TAGS_SERVICE
        );
        await tagsService.deleteTag(input.id);
        return { success: true };
      } catch (error) {
        throw new Error(
          `Failed to delete tag: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
});

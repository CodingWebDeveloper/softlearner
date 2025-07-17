import { z } from 'zod';
import { getTags, createTag, updateTag, deleteTag } from '../../../services/tags-service';
import { router, procedure } from '../server';

const getTagsInput = z.object({
  search: z.string().optional(),
  limit: z.number().min(1).max(100).optional(),
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
  getTags: procedure
    .input(getTagsInput.optional())
    .query(async ({ input }) => {
      try {
        const tags = await getTags(input);
        return tags;
      } catch (error) {
        throw new Error(`Failed to fetch tags: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  createTag: procedure
    .input(createTagInput)
    .mutation(async ({ input }) => {
      try {
        const tag = await createTag(input.name);
        return tag;
      } catch (error) {
        throw new Error(`Failed to create tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  updateTag: procedure
    .input(updateTagInput)
    .mutation(async ({ input }) => {
      try {
        const tag = await updateTag(input.id, input.name);
        return tag;
      } catch (error) {
        throw new Error(`Failed to update tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  deleteTag: procedure
    .input(deleteTagInput)
    .mutation(async ({ input }) => {
      try {
        await deleteTag(input.id);
        return { success: true };
      } catch (error) {
        throw new Error(`Failed to delete tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
}); 
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { getResourcesByCourseId } from '@/services/resources-service';

const t = initTRPC.create();

export const resourcesRouter = t.router({
  getResourcesByCourseId: t.procedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ input }) => {
      try {
        const resources = await getResourcesByCourseId(input.courseId);
        return resources;
      } catch (error) {
        throw new Error(`Failed to fetch resources: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
}); 
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { getSectionsByCourseId } from '../../../services/sections-service';

const t = initTRPC.create();

export const sectionsRouter = t.router({
  getSectionsByCourseId: t.procedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ input }) => {
      try {
        const sections = await getSectionsByCourseId(input.courseId);
        return sections;
      } catch (error) {
        throw new Error(`Failed to fetch sections: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
}); 
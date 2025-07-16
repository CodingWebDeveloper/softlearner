import { z } from 'zod';
import { getResourcesByCourseId } from '@/services/resources-service';
import { router, procedure } from '../server';


export const resourcesRouter =  router({
  getResourcesByCourseId: procedure
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
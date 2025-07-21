import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { IResourcesService } from "@/services/interfaces/service.interfaces";
import { DI_TOKENS } from "@/lib/di/registry";

export const resourcesRouter = router({
  getResourcesByCourseId: publicProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const resourcesService = ctx.container.resolve<IResourcesService>(
          DI_TOKENS.RESOURCES_SERVICE
        );
        return await resourcesService.getResourcesByCourseId(input.courseId);
      } catch (error) {
        throw new Error(
          `Failed to fetch resources: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
});

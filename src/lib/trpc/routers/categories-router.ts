import { publicProcedure, router } from "../trpc";
import { ICategoriesService } from "@/services/interfaces/service.interfaces";
import { DI_TOKENS } from "@/lib/di/registry";

export const categoriesRouter = router({
  getCategories: publicProcedure.query(async ({ ctx }) => {
    try {
      const categoriesService = ctx.container.resolve<ICategoriesService>(
        DI_TOKENS.CATEGORIES_SERVICE
      );

      return await categoriesService.getCategories();
    } catch (error) {
      throw new Error(
        `Failed to fetch categories: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }),
});

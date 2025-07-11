import { initTRPC } from '@trpc/server';
import { getCategories } from '../../../services/categories-service';

const t = initTRPC.create();

export const categoriesRouter = t.router({
  getCategories: t.procedure.query(async () => {
    try {
      const categories = await getCategories();
      return categories;
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }),
}); 
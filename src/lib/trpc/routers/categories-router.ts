import { getCategories } from '../../../services/categories-service';
import { router, procedure } from '../server';


export const categoriesRouter = router({
  getCategories: procedure.query(async () => {
    try {
      const categories = await getCategories();
      return categories;
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }),
}); 
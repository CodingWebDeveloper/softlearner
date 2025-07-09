import { getCategories as getCategoriesDb } from '@/lib/database/database';
import type { Category } from '@/lib/database/database';

export const getCategories = async (): Promise<Category[]> => {
  return getCategoriesDb();
}; 
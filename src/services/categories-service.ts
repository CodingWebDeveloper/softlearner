import { createClient } from '../lib/supabase/client';
import type { Category } from '@/lib/database/database';

export const getCategories = async (): Promise<Category[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    // Optionally log error here
    throw new Error(error.message);
  }

  return data;
}; 
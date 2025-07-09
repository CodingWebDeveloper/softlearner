import { createClient } from '@/lib/supabase/client';
import type { Tag } from '@/lib/database/database';

export interface GetTagsParams {
  search?: string;
  limit?: number;
}

export const getTags = async (params: GetTagsParams = {}): Promise<Tag[]> => {
  const supabase = createClient();
  const { search, limit } = params;

  let query = supabase
    .from('tags')
    .select('*');

  // Apply search filter
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  // Apply limit if specified
  if (limit) {
    query = query.limit(limit);
  }

  // Apply ordering
  query = query.order('name', { ascending: true });

  const { data: tags, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch tags: ${error.message}`);
  }

  return tags as Tag[];
};

export const createTag = async (name: string): Promise<Tag> => {
  const supabase = createClient();
  
  const { data: tag, error } = await supabase
    .from('tags')
    .insert([{ name }])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create tag: ${error.message}`);
  }

  return tag as Tag;
};

export const updateTag = async (id: string, name: string): Promise<Tag> => {
  const supabase = createClient();
  
  const { data: tag, error } = await supabase
    .from('tags')
    .update({ name })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update tag: ${error.message}`);
  }

  return tag as Tag;
};

export const deleteTag = async (id: string): Promise<void> => {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete tag: ${error.message}`);
  }
}; 
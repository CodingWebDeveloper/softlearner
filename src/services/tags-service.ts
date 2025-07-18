import { createClient } from "@/lib/supabase/server";
import type { Tag } from "@/lib/database/database.types";
import { GetTagsParams } from "./interfaces/service.interfaces";

export const getTags = async (params: GetTagsParams = {}): Promise<Tag[]> => {
  const supabase = await createClient();
  const { search, limit } = params;

  let query = supabase.from("tags").select("*");

  // Apply search filter
  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  // Apply limit if specified
  if (limit) {
    query = query.limit(limit);
  }

  // Apply ordering
  query = query.order("name", { ascending: true });

  const { data: tags, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch tags: ${error.message}`);
  }

  return tags as Tag[];
};

export const getTagsByCourseId = async (courseId: string): Promise<Tag[]> => {
  const supabase = await createClient();

  // First, let's check if we have any course_tags entries for this course
  const { data: courseTagsCheck, error: checkError } = await supabase
    .from("course_tags")
    .select("tag_id")
    .eq("course_id", courseId);

  if (checkError) {
    console.error("Error checking course tags:", checkError);
    throw new Error(`Failed to check course tags: ${checkError.message}`);
  }

  if (!courseTagsCheck || courseTagsCheck.length === 0) {
    return [];
  }

  // Get the tag IDs
  const tagIds = courseTagsCheck.map((ct) => ct.tag_id);

  // Now fetch the actual tags
  const { data: tags, error } = await supabase
    .from("tags")
    .select("id, name")
    .in("id", tagIds);

  if (error) {
    console.error("Error fetching tags:", error);
    throw new Error(
      `Failed to fetch tags for course ${courseId}: ${error.message}`
    );
  }

  if (!tags) return [];

  return tags as Tag[];
};

export const createTag = async (name: string): Promise<Tag> => {
  const supabase = await createClient();

  const { data: tag, error } = await supabase
    .from("tags")
    .insert([{ name }])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create tag: ${error.message}`);
  }

  return tag as Tag;
};

export const updateTag = async (id: string, name: string): Promise<Tag> => {
  const supabase = await createClient();

  const { data: tag, error } = await supabase
    .from("tags")
    .update({ name })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update tag: ${error.message}`);
  }

  return tag as Tag;
};

export const deleteTag = async (id: string): Promise<void> => {
  const supabase = await createClient();

  const { error } = await supabase.from("tags").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete tag: ${error.message}`);
  }
};

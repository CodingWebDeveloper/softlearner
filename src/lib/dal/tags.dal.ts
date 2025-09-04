import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { ITagsDAL } from "../di/interfaces/dal.interfaces";
import { Tag } from "../database/database.types";
import { GetTagsParams } from "@/services/interfaces/service.interfaces";

export class TagsDAL implements ITagsDAL {
  constructor(private supabase: SupabaseClient<Database>) {}

  async createTagsByCourse(courseId: string, tagIds: string[]): Promise<void> {
    // First get existing tag associations
    const { data: existingTags, error: fetchError } = await this.supabase
      .from("course_tags")
      .select("tag_id")
      .eq("course_id", courseId);

    if (fetchError) {
      throw new Error(`Error fetching existing course tags: ${fetchError.message}`);
    }

    const existingTagIds = existingTags?.map(tag => tag.tag_id) || [];

    // Find tags to add (tags in tagIds but not in existingTagIds)
    const tagsToAdd = tagIds.filter(id => !existingTagIds.includes(id));

    // Find tags to remove (tags in existingTagIds but not in tagIds)
    const tagsToRemove = existingTagIds.filter(id => !tagIds.includes(id));

    // Start a transaction for both operations
    if (tagsToAdd.length > 0) {
      // Create new associations
      const newCourseTags = tagsToAdd.map(tagId => ({
        course_id: courseId,
        tag_id: tagId
      }));

      const { error: insertError } = await this.supabase
        .from("course_tags")
        .insert(newCourseTags);

      if (insertError) {
        throw new Error(`Error creating course tags: ${insertError.message}`);
      }
    }

    if (tagsToRemove.length > 0) {
      // Remove old associations
      const { error: deleteError } = await this.supabase
        .from("course_tags")
        .delete()
        .eq("course_id", courseId)
        .in("tag_id", tagsToRemove);

      if (deleteError) {
        throw new Error(`Error removing course tags: ${deleteError.message}`);
      }
    }
  }

  async getTags(params: GetTagsParams = {}): Promise<Tag[]> {
    const { search, limit } = params;

    let query = this.supabase.from("tags").select("*");

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
      throw new Error(`Error fetching tags: ${error.message}`);
    }

    return tags;
  }

  async getTagsByCourseId(courseId: string): Promise<Tag[]> {
    // First, let's check if we have any course_tags entries for this course
    const { data: courseTagsCheck, error: checkError } = await this.supabase
      .from("course_tags")
      .select("tag_id")
      .eq("course_id", courseId);

    if (checkError) {
      throw new Error(`Error checking course tags: ${checkError.message}`);
    }

    if (!courseTagsCheck || courseTagsCheck.length === 0) {
      return [];
    }

    // Get the tag IDs
    const tagIds = courseTagsCheck.map((ct) => ct.tag_id);

    // Now fetch the actual tags
    const { data: tags, error } = await this.supabase
      .from("tags")
      .select("id, name")
      .in("id", tagIds);

    if (error) {
      throw new Error(
        `Error fetching tags for course ${courseId}: ${error.message}`
      );
    }

    return tags || [];
  }

  async createTag(name: string): Promise<Tag> {
    const { data: tag, error } = await this.supabase
      .from("tags")
      .insert([{ name }])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating tag: ${error.message}`);
    }

    return tag;
  }

  async updateTag(id: string, name: string): Promise<Tag> {
    const { data: tag, error } = await this.supabase
      .from("tags")
      .update({ name })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating tag: ${error.message}`);
    }

    return tag;
  }

  async deleteTag(id: string): Promise<void> {
    const { error } = await this.supabase.from("tags").delete().eq("id", id);

    if (error) {
      throw new Error(`Error deleting tag: ${error.message}`);
    }
  }
}

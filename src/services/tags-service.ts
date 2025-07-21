import { ITagsDAL } from "@/lib/di/interfaces/dal.interfaces";
import { ITagsService } from "./interfaces/service.interfaces";
import { Tag } from "@/lib/database/database.types";
import { GetTagsParams } from "./interfaces/service.interfaces";

export class TagsService implements ITagsService {
  constructor(private tagsDAL: ITagsDAL) {}

  async getTags(params?: GetTagsParams): Promise<Tag[]> {
    return this.tagsDAL.getTags(params);
  }

  async getTagsByCourseId(courseId: string): Promise<Tag[]> {
    return this.tagsDAL.getTagsByCourseId(courseId);
  }

  async createTag(name: string): Promise<Tag> {
    return this.tagsDAL.createTag(name);
  }

  async updateTag(id: string, name: string): Promise<Tag> {
    return this.tagsDAL.updateTag(id, name);
  }

  async deleteTag(id: string): Promise<void> {
    await this.tagsDAL.deleteTag(id);
  }
}

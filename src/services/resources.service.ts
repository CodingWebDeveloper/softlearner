import { IResourcesDAL } from "@/lib/di/interfaces/dal.interfaces";
import { IResourcesService } from "./interfaces/service.interfaces";
import { PreviewResource } from "@/lib/database/database.types";

export class ResourcesService implements IResourcesService {
  constructor(private resourcesDAL: IResourcesDAL) {}

  async getResourcesByCourseId(courseId: string): Promise<PreviewResource[]> {
    return this.resourcesDAL.getResourcesByCourseId(courseId);
  }
}

import { IResourcesDAL } from "@/lib/di/interfaces/dal.interfaces";
import { CreateResourceParams, IResourcesService, SimpleResource } from "./interfaces/service.interfaces";
import { PreviewResource } from "@/lib/database/database.types";
import { BasicResource } from "./interfaces/service.interfaces";

export class ResourcesService implements IResourcesService {
  constructor(private resourcesDAL: IResourcesDAL) {}

  async getResourcesByCourseId(courseId: string): Promise<PreviewResource[]> {
    return this.resourcesDAL.getResourcesByCourseId(courseId);
  }

  async getResourceMaterialsByCourseId(
    courseId: string,
    userId?: string
  ): Promise<BasicResource[]> {
    return this.resourcesDAL.getResourceMaterialsByCourseId(courseId, userId);
  }

  async getNextResourceToComplete(
    courseId: string,
    userId: string
  ): Promise<string | null> {
    return this.resourcesDAL.getNextResourceToComplete(courseId, userId);
  }

  async toggleResourceCompletion(
    userId: string,
    resourceId: string
  ): Promise<boolean> {
    return this.resourcesDAL.toggleResourceCompletion(userId, resourceId);
  }

  async getResourceCompletionStatus(
    userId: string,
    resourceId: string
  ): Promise<boolean> {
    return this.resourcesDAL.getResourceCompletionStatus(userId, resourceId);
  }

  async createResource(params: CreateResourceParams): Promise<SimpleResource> {
    return this.resourcesDAL.createResource(params);
  }
}

import { IResourcesDAL } from "@/lib/di/interfaces/dal.interfaces";
import { CreateResourceParams, IResourcesService, SimpleResource, UpdateResourceParams, ActivityResource } from "./interfaces/service.interfaces";
import { PreviewResource } from "@/lib/database/database.types";
import { BasicResource } from "./interfaces/service.interfaces";

export class ResourcesService implements IResourcesService {
  constructor(private resourcesDAL: IResourcesDAL) {}

  async getResourcesByCourseId(courseId: string): Promise<PreviewResource[]> {
    return this.resourcesDAL.getResourcesByCourseId(courseId);
  }

  async getAllResourcesByCourseId(courseId: string): Promise<SimpleResource[]> {
    return this.resourcesDAL.getAllResourcesByCourseId(courseId);
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

  async updateResource(
    resourceId: string,
    params: UpdateResourceParams
  ): Promise<SimpleResource> {
    return this.resourcesDAL.updateResource(resourceId, params);
  }

  async updateResourcesOrder(
    courseId: string,
    orderUpdates: { id: string; order_index: number }[]
  ): Promise<SimpleResource[]> {
    return this.resourcesDAL.updateResourcesOrder(courseId, orderUpdates);
  }

  async downloadResourceFile(resourceId: string): Promise<Blob> {
    return this.resourcesDAL.downloadResourceFile(resourceId);
  }

  async deleteResource(resourceId: string): Promise<void> {
    return this.resourcesDAL.deleteResource(resourceId);
  }

  async getUserCompletedResourcesByYear(
    userId: string,
    year: number
  ): Promise<ActivityResource[]> {
    return this.resourcesDAL.getUserCompletedResourcesByYear(userId, year);
  }
}

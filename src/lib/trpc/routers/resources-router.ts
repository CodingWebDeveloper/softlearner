import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { IResourcesService } from "@/services/interfaces/service.interfaces";
import { DI_TOKENS } from "@/lib/di/registry";
import { RESOURCE_TYPES } from "@/lib/constants/database-constants";

export const resourcesRouter = router({
  createResource: protectedProcedure
    .input(z.instanceof(FormData))
    .mutation(async ({ ctx, input }) => {
      try {
        const resourcesService = ctx.container.resolve<IResourcesService>(
          DI_TOKENS.RESOURCES_SERVICE
        );

        const formData = input;
        const type = formData.get("type") as "video" | "downloadable";
        
        // Map form type to RESOURCE_TYPES
        const resourceType = type === "video" ? RESOURCE_TYPES.VIDEO : RESOURCE_TYPES.DOWNLOADABLE_FILE;

        const resourceData = {
          name: formData.get("title") as string,
          short_summary: formData.get("description") as string,
          type: resourceType,
          course_id: formData.get("course_id") as string,
          duration: formData.get("duration") as string,
          url: type === "video" ? formData.get("url") as string : undefined,
          file: type === "downloadable" ? formData.get("file") as File : undefined
        };

        // Validate the extracted data
        if (!resourceData.name || resourceData.name.length === 0) {
          throw new Error("Name is required");
        }
        if (!resourceData.short_summary || resourceData.short_summary.length === 0) {
          throw new Error("Description is required");
        }
        if (!resourceData.course_id) {
          throw new Error("Course ID is required");
        }
        if (!resourceData.duration || !resourceData.duration.match(/^([0-9]+:)?[0-5]?[0-9]:[0-5][0-9]$/)) {
          throw new Error("Duration must be in format HH:MM:SS or MM:SS");
        }

        // Type-specific validations
        
        if (type === "video" && (!resourceData.url || !resourceData.url.startsWith("http"))) {
          throw new Error("Valid video URL is required");
        }
        if (type === "downloadable") {
          if (!resourceData.file) {
            throw new Error("File is required for downloadable resources");
          }
          const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes
          if (resourceData.file.size > MAX_FILE_SIZE) {
            throw new Error("File size must be less than 20MB");
          }
        }

        return await resourcesService.createResource(resourceData);
      } catch (error) {
        throw new Error(
          `Failed to create resource: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
  getResourcesByCourseId: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const resourcesService = ctx.container.resolve<IResourcesService>(
          DI_TOKENS.RESOURCES_SERVICE
        );
        return await resourcesService.getResourcesByCourseId(input.courseId);
      } catch (error) {
        throw new Error(
          `Failed to fetch resources: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getResourceMaterialsByCourseId: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const resourcesService = ctx.container.resolve<IResourcesService>(
          DI_TOKENS.RESOURCES_SERVICE
        );
        return await resourcesService.getResourceMaterialsByCourseId(
          input.courseId,
          ctx.user.id
        );
      } catch (error) {
        throw new Error(
          `Failed to fetch resource materials: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getNextResourceToComplete: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const resourcesService = ctx.container.resolve<IResourcesService>(
          DI_TOKENS.RESOURCES_SERVICE
        );
        return await resourcesService.getNextResourceToComplete(
          input.courseId,
          ctx.user.id
        );
      } catch (error) {
        throw new Error(
          `Failed to get next resource to complete: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  toggleResourceCompletion: protectedProcedure
    .input(z.object({ resourceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const resourcesService = ctx.container.resolve<IResourcesService>(
          DI_TOKENS.RESOURCES_SERVICE
        );
        return await resourcesService.toggleResourceCompletion(
          ctx.user.id,
          input.resourceId
        );
      } catch (error) {
        throw new Error(
          `Failed to toggle resource completion: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getResourceCompletionStatus: protectedProcedure
    .input(z.object({ resourceId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const resourcesService = ctx.container.resolve<IResourcesService>(
          DI_TOKENS.RESOURCES_SERVICE
        );
        return await resourcesService.getResourceCompletionStatus(
          ctx.user.id,
          input.resourceId
        );
      } catch (error) {
        throw new Error(
          `Failed to get resource completion status: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
});

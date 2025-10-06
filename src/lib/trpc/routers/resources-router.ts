import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { IResourcesService, UpdateResourceParams } from "@/services/interfaces/service.interfaces";
import { DI_TOKENS } from "@/lib/di/registry";
import { RESOURCE_TYPES, ResourceType } from "@/lib/constants/database-constants";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes

export const resourcesRouter = router({
  createResource: protectedProcedure
    .input(z.instanceof(FormData))
    .mutation(async ({ ctx, input }) => {
      try {
        const resourcesService = ctx.container.resolve<IResourcesService>(
          DI_TOKENS.RESOURCES_SERVICE
        );

        const formData = input;
        const type = formData.get("type") as ResourceType;
        
        // Map form type to RESOURCE_TYPES
        const resourceType = type === RESOURCE_TYPES.VIDEO ? RESOURCE_TYPES.VIDEO : RESOURCE_TYPES.DOWNLOADABLE_FILE;

        const resourceData = {
          name: formData.get("name") as string,
          short_summary: formData.get("short_summary") as string,
          type: resourceType,
          course_id: formData.get("course_id") as string,
          duration: formData.get("duration") as string,
          order_index: parseInt(formData.get("order_index") as string),
          url: type === RESOURCE_TYPES.VIDEO ? formData.get("url") as string : undefined,
          file: type === RESOURCE_TYPES.DOWNLOADABLE_FILE ? formData.get("file") as File : undefined
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

        if (!resourceData.order_index || resourceData.order_index < 0) {
          throw new Error("Order index is required and must be greater than 0");
        }

        // Type-specific validations
        if (type === RESOURCE_TYPES.VIDEO && (!resourceData.url || !resourceData.url.startsWith("http"))) {
          throw new Error("Valid video URL is required");
        }
        if (type === RESOURCE_TYPES.DOWNLOADABLE_FILE) {
          if (!resourceData.file) {
            throw new Error("File is required for downloadable resources");
          }
          if (resourceData.file.size > MAX_FILE_SIZE) {
            throw new Error(`File size must be less than ${MAX_FILE_SIZE}MB`);
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

  updateResource: protectedProcedure
    .input(z.instanceof(FormData))
    .mutation(async ({ ctx, input }) => {
      try {
        const resourcesService = ctx.container.resolve<IResourcesService>(
          DI_TOKENS.RESOURCES_SERVICE
        );

        const formData = input;
        const resourceId = formData.get("id") as string;
        const type = formData.get("type") as ResourceType;
        const file = formData.get("file") as File | null;

        if (!resourceId) {
          throw new Error("Resource ID is required");
        }

        // Build update object
        const updates: UpdateResourceParams = {
          name: formData.get("name") as string,
          short_summary: formData.get("short_summary") as string,
          duration: formData.get("duration") as string,
          type,
        };

        // Handle file based on type
        if (type === RESOURCE_TYPES.DOWNLOADABLE_FILE && file) {
          // Only validate file if it's provided
          if (file.size > MAX_FILE_SIZE) {
            throw new Error(`File size must be less than ${MAX_FILE_SIZE}MB`);
          }
          updates.file = file;
        }

        return await resourcesService.updateResource(resourceId, updates);
      } catch (error) {
        throw new Error(
          `Failed to update resource: ${
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

  getAllResourcesByCourseId: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const resourcesService = ctx.container.resolve<IResourcesService>(
          DI_TOKENS.RESOURCES_SERVICE
        );
        return await resourcesService.getAllResourcesByCourseId(input.courseId);
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

  getUserCompletedResourcesByYear: protectedProcedure
    .input(z.object({ year: z.number().int().min(1970).max(3000) }))
    .query(async ({ ctx, input }) => {
      try {
        const resourcesService = ctx.container.resolve<IResourcesService>(
          DI_TOKENS.RESOURCES_SERVICE
        );
        const userId = ctx.user.id;
        return await resourcesService.getUserCompletedResourcesByYear(
          userId,
          input.year
        );
      } catch (error) {
        throw new Error(
          `Failed to load user activity: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  updateResourcesOrder: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        orderUpdates: z.array(
          z.object({
            id: z.string(),
            order_index: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const resourcesService = ctx.container.resolve<IResourcesService>(
          DI_TOKENS.RESOURCES_SERVICE
        );
        return await resourcesService.updateResourcesOrder(
          input.courseId,
          input.orderUpdates
        );
      } catch (error) {
        throw new Error(
          `${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  downloadResourceFile: protectedProcedure
    .input(z.object({ resourceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const resourcesService = ctx.container.resolve<IResourcesService>(
          DI_TOKENS.RESOURCES_SERVICE
        );
        
        const blob = await resourcesService.downloadResourceFile(input.resourceId);
        
        // Convert Blob to base64 for transmission
        const buffer = await blob.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        
        return {
          data: base64,
          type: blob.type,
          size: blob.size,
        };
      } catch (error) {
        throw new Error(
          `Failed to download resource file: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  deleteResource: protectedProcedure
    .input(z.object({ resourceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const resourcesService = ctx.container.resolve<IResourcesService>(
          DI_TOKENS.RESOURCES_SERVICE
        );
        
        await resourcesService.deleteResource(input.resourceId);
        
        return { success: true };
      } catch (error) {
        throw new Error(
          `Failed to delete resource: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
});
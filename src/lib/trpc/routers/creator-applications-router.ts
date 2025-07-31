import { z } from "zod";
import { ICreatorApplicationsService } from "@/services/interfaces/service.interfaces";
import { DI_TOKENS } from "@/lib/di/registry";
import { router, protectedProcedure, requireRole } from "../trpc";

// Input validation schemas
const createApplicationInput = z.object({
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  content_type: z.string().min(1, "Content type is required"),
  portfolio_links: z
    .array(z.string().url("Invalid URL format"))
    .min(1, "At least one portfolio link is required"),
  experience_level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  motivation: z.string().min(20, "Motivation must be at least 20 characters"),
});

const getApplicationsInput = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(15),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  search: z.string().optional(),
});

const updateApplicationStatusInput = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
  admin_notes: z.string().optional(),
});

const logApplicationActionInput = z.object({
  action: z.string().min(1, "Action is required"),
  notes: z.string().optional(),
});

export const creatorApplicationsRouter = router({
  // User endpoints
  createApplication: protectedProcedure
    .input(createApplicationInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const creatorApplicationsService =
          ctx.container.resolve<ICreatorApplicationsService>(
            DI_TOKENS.CREATOR_APPLICATIONS_SERVICE
          );

        return await creatorApplicationsService.createApplication(
          ctx.user.id,
          input
        );
      } catch (error) {
        throw new Error(
          `Failed to create application: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getUserApplication: protectedProcedure.query(async ({ ctx }) => {
    try {
      const creatorApplicationsService =
        ctx.container.resolve<ICreatorApplicationsService>(
          DI_TOKENS.CREATOR_APPLICATIONS_SERVICE
        );

      return await creatorApplicationsService.getUserApplication(ctx.user.id);
    } catch (error) {
      throw new Error(
        `Failed to fetch user application: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }),

  // Admin endpoints
  getApplications: protectedProcedure
    .input(getApplicationsInput)
    .use(requireRole("admin"))
    .query(async ({ ctx, input }) => {
      try {
        const creatorApplicationsService =
          ctx.container.resolve<ICreatorApplicationsService>(
            DI_TOKENS.CREATOR_APPLICATIONS_SERVICE
          );

        return await creatorApplicationsService.getApplications(input);
      } catch (error) {
        throw new Error(
          `Failed to fetch applications: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getApplicationById: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      try {
        const creatorApplicationsService =
          ctx.container.resolve<ICreatorApplicationsService>(
            DI_TOKENS.CREATOR_APPLICATIONS_SERVICE
          );

        const application = await creatorApplicationsService.getApplicationById(
          input
        );

        if (!application) {
          throw new Error("Application not found");
        }

        return application;
      } catch (error) {
        throw new Error(
          `Failed to fetch application: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  updateApplicationStatus: protectedProcedure
    .input(
      z.object({
        applicationId: z.string().uuid(),
        ...updateApplicationStatusInput.shape,
      })
    )
    .use(requireRole("admin"))
    .mutation(async ({ ctx, input }) => {
      try {
        const creatorApplicationsService =
          ctx.container.resolve<ICreatorApplicationsService>(
            DI_TOKENS.CREATOR_APPLICATIONS_SERVICE
          );

        const { applicationId, ...updateData } = input;

        return await creatorApplicationsService.updateApplicationStatus(
          applicationId,
          ctx.user.id,
          updateData
        );
      } catch (error) {
        throw new Error(
          `Failed to update application status: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getApplicationLogs: protectedProcedure
    .input(z.string().uuid())
    .use(requireRole("admin"))
    .query(async ({ ctx, input }) => {
      try {
        const creatorApplicationsService =
          ctx.container.resolve<ICreatorApplicationsService>(
            DI_TOKENS.CREATOR_APPLICATIONS_SERVICE
          );

        return await creatorApplicationsService.getApplicationLogs(input);
      } catch (error) {
        throw new Error(
          `Failed to fetch application logs: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  logApplicationAction: protectedProcedure
    .input(
      z.object({
        applicationId: z.string().uuid(),
        ...logApplicationActionInput.shape,
      })
    )
    .use(requireRole("admin"))
    .mutation(async ({ ctx, input }) => {
      try {
        const creatorApplicationsService =
          ctx.container.resolve<ICreatorApplicationsService>(
            DI_TOKENS.CREATOR_APPLICATIONS_SERVICE
          );

        const { applicationId, ...logData } = input;

        return await creatorApplicationsService.logApplicationAction(
          applicationId,
          ctx.user.id,
          logData.action,
          logData.notes
        );
      } catch (error) {
        throw new Error(
          `Failed to log application action: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
});

import { z } from "zod";
import { IUsersService } from "@/services/interfaces/service.interfaces";
import { DI_TOKENS } from "@/lib/di/registry";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const usersRouter = router({
  getUserProfile: protectedProcedure.query(async ({ ctx }) => {
    try {
      const usersService = ctx.container.resolve<IUsersService>(
        DI_TOKENS.USERS_SERVICE
      );

      return await usersService.getUserDetails(ctx.user.id);
    } catch (error) {
      throw new Error(
        `Failed to fetch user profile: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }),
  getUserDetailsByUsername: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      try {
        const usersService = ctx.container.resolve<IUsersService>(
          DI_TOKENS.USERS_SERVICE
        );

        return await usersService.getUserDetailsByUsername(input);
      } catch (error) {
        throw new Error(
          `Failed to fetch user details by username: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
  updateProfile: protectedProcedure
    .input(
      z.object({
        full_name: z.string().optional(),
        username: z.string().optional(),
        bio: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const usersService = ctx.container.resolve<IUsersService>(
          DI_TOKENS.USERS_SERVICE
        );

        return await usersService.updateUserDetails(ctx.user.id, input);
      } catch (error) {
        throw new Error(
          `Failed to update user profile: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
  uploadProfileImage: protectedProcedure
    .input(z.instanceof(FormData))
    .mutation(async ({ ctx, input }) => {
      const file = input.get("file") as File;

      if (!file) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No file provided",
        });
      }

      const usersService = ctx.container.resolve<IUsersService>(
        DI_TOKENS.USERS_SERVICE
      );

      const result = await usersService.uploadProfileImage(ctx.user.id, file);

      return result;
    }),
  getProfileImage: protectedProcedure
    .input(
      z.object({
        avatarPath: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const usersService = ctx.container.resolve<IUsersService>(
        DI_TOKENS.USERS_SERVICE
      );

      const blob = await usersService.getProfileImageBlob(input.avatarPath);

      // Convert blob to base64 for tRPC transmission
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");

      return {
        blob: base64,
        type: blob.type,
        size: blob.size,
      };
    }),
  removeProfileImage: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const usersService = ctx.container.resolve<IUsersService>(
        DI_TOKENS.USERS_SERVICE
      );

      await usersService.removeProfileImage(ctx.user.id);

      return { success: true };
    } catch (error) {
      throw new Error(
        `Failed to remove profile image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }),
});

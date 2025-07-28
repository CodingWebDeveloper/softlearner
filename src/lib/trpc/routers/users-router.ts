import { z } from "zod";
import { IUsersService } from "@/services/interfaces/service.interfaces";
import { DI_TOKENS } from "@/lib/di/registry";
import { router, protectedProcedure } from "../trpc";

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
});

import { z } from "zod";
import { ITestsService } from "@/services/interfaces/service.interfaces";
import { DI_TOKENS } from "@/lib/di/registry";
import { router, protectedProcedure } from "../trpc";

export const testsRouter = router({
  getTests: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input: courseId }) => {
      try {
        const testsService = ctx.container.resolve<ITestsService>(
          DI_TOKENS.TESTS_SERVICE
        );

        return await testsService.getTests(courseId);
      } catch (error) {
        throw new Error(
          `Failed to fetch tests: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getTestById: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input: testId }) => {
      try {
        const testsService = ctx.container.resolve<ITestsService>(
          DI_TOKENS.TESTS_SERVICE
        );

        const test = await testsService.getTestById(testId);

        if (!test) {
          throw new Error("Test not found");
        }

        return test;
      } catch (error) {
        throw new Error(
          `Failed to fetch test: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getTestMaterials: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input: courseId }) => {
      try {
        const testsService = ctx.container.resolve<ITestsService>(
          DI_TOKENS.TESTS_SERVICE
        );

        return await testsService.getTestMaterials(courseId, ctx.user.id);
      } catch (error) {
        throw new Error(
          `Failed to fetch test materials: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  createScore: protectedProcedure
    .input(
      z.object({
        testId: z.string().uuid(),
        submission: z.record(z.string().uuid(), z.array(z.string().uuid())),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const testsService = ctx.container.resolve<ITestsService>(
          DI_TOKENS.TESTS_SERVICE
        );

        return await testsService.createScore(
          input.testId,
          ctx.user.id,
          input.submission
        );
      } catch (error) {
        throw new Error(
          `Failed to create score: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
});

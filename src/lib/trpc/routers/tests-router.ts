import { z } from "zod";
import { ITestsService } from "@/services/interfaces/service.interfaces";
import { DI_TOKENS } from "@/lib/di/registry";
import { router, protectedProcedure } from "../trpc";

const updateTestInput = z.object({
  id: z.string().uuid(),
  data: z.object({
    title: z.string().min(3).max(100),
    description: z.string().max(500),
  }),
});

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

  getTestQuestions: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input: testId }) => {
      try {
        const testsService = ctx.container.resolve<ITestsService>(
          DI_TOKENS.TESTS_SERVICE
        );

        return await testsService.getTestQuestions(testId);
      } catch (error) {
        throw new Error(
          `Failed to fetch test questions: ${
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

  updateTest: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: z.object({
          title: z.string().min(3).max(100),
          description: z.string().max(500),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const testsService = ctx.container.resolve<ITestsService>(
          DI_TOKENS.TESTS_SERVICE
        );

        return await testsService.updateTest(input.id, input.data);
      } catch (error) {
        throw new Error(
          `Failed to update test: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
  deleteTest: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input: courseId }) => {
      try {
        const testsService = ctx.container.resolve<ITestsService>(
          DI_TOKENS.TESTS_SERVICE
        );

        return await testsService.deleteTest(courseId);
      } catch (error) {
        throw new Error(
          `Failed to delete test: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
  saveQuestions: protectedProcedure
    .input(
      z.object({
        testId: z.string().uuid(),
        questions: z
          .array(
            z.object({
              id: z.string().uuid().optional(),
              text: z.string().min(1, "Question text is required"),
              type: z.enum(["single", "multiple"]),
              points: z.number().min(1, "Points must be at least 1"),
              status: z.enum(["NEW", "UPDATED", "INITIAL"]),
              options: z
                .array(
                  z.object({
                    id: z.string().uuid().optional(),
                    text: z.string().min(1, "Option text is required"),
                    isCorrect: z.boolean(),
                    status: z.enum(["NEW", "UPDATED", "INITIAL"]),
                  })
                )
                .min(2, "At least 2 options are required"),
            })
          )
          .min(1, "At least 1 question is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const testsService = ctx.container.resolve<ITestsService>(
          DI_TOKENS.TESTS_SERVICE
        );

        return await testsService.saveQuestions(input);
      } catch (error) {
        throw new Error(
          `Failed to save questions: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  createTest: protectedProcedure
    .input(
      z.object({
        courseId: z.string().uuid(),
        data: z.object({
          title: z.string().min(3).max(100),
          description: z.string().max(500),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const testsService = ctx.container.resolve<ITestsService>(
          DI_TOKENS.TESTS_SERVICE
        );

        return await testsService.createTest(input.courseId, input.data);
      } catch (error) {
        throw new Error(
          `Failed to create test: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
  getAverageTestScoreByUser: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const testsService = ctx.container.resolve<ITestsService>(
          DI_TOKENS.TESTS_SERVICE
        );
        return await testsService.getAverageTestScoreByUser(ctx.user.id);
      } catch (error) {
        throw new Error(
          `Failed to fetch average test score: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
});

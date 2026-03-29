import { z } from "zod";
import { DI_TOKENS } from "@/lib/di/registry";
import { router, protectedProcedure } from "../trpc";
import { IAiTestsService } from "@/services/interfaces/service.interfaces";

const generateInput = z.object({
  topic: z.string().min(1, "Topic is required"),
  numQuestions: z.number().int().min(1).max(20).optional(),
  difficulty: z.enum(["knowledge", "skill", "competence"]).optional(),
});

export const aiTestsRouter = router({
  generateQuestions: protectedProcedure
    .input(generateInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const aiService = ctx.container.resolve<IAiTestsService>(
          DI_TOKENS.AI_TESTS_SERVICE
        );
        const result = await aiService.generateQuestions(input);
        return result;
      } catch (error) {
        throw new Error(
          `Failed to generate questions: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
});

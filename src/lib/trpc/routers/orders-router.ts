import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { DI_TOKENS } from "@/lib/di/registry";
import type { IOrdersService } from "@/services/orders.service";

export const ordersRouter = router({
  getOrdersByCourseId: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input: courseId }) => {
      const ordersService = ctx.container.resolve<IOrdersService>(
        DI_TOKENS.ORDERS_SERVICE
      );
      return ordersService.getOrdersByCourseId(courseId);
    }),
});

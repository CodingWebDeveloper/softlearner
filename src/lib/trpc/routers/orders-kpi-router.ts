import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { DI_TOKENS } from "@/lib/di/registry";
import { IOrdersKpiService } from "@/services/interfaces/service.interfaces";

const totalRevenueInput = z
  .object({
    currency: z.string().min(1).optional(),
    from: z.string().optional(), // ISO
    to: z.string().optional(), // ISO
  })
  .optional();

const currentMonthRevenueInput = z
  .object({
    currency: z.string().min(1).optional(),
  })
  .optional();

const revenueSeriesInput = z
  .object({
    period: z.enum(["7d", "30d", "1y"]).nullable().optional(),
    currency: z.string().min(1).optional(),
  })
  .optional();

const revenueByCourseInput = z
  .object({
    currency: z.string().min(1).optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    limit: z.number().int().min(1).max(50).optional(),
  })
  .optional();

const studentsByCourseInput = z
  .object({
    from: z.string().optional(),
    to: z.string().optional(),
    limit: z.number().int().min(1).max(50).optional(),
  })
  .optional();

export const ordersKpiRouter = router({
  getTotalRevenue: protectedProcedure
    .input(totalRevenueInput)
    .query(async ({ ctx, input }) => {
      const svc = ctx.container.resolve<IOrdersKpiService>(
        DI_TOKENS.ORDERS_KPI_SERVICE
      );
      return svc.getTotalRevenue(ctx.user.id, input ?? undefined);
    }),

  getCurrentMonthRevenue: protectedProcedure
    .input(currentMonthRevenueInput)
    .query(async ({ ctx, input }) => {
      const svc = ctx.container.resolve<IOrdersKpiService>(
        DI_TOKENS.ORDERS_KPI_SERVICE
      );
      return svc.getCurrentMonthRevenue(ctx.user.id, input ?? undefined);
    }),

  getRevenueSeries: protectedProcedure
    .input(revenueSeriesInput)
    .query(async ({ ctx, input }) => {
      const svc = ctx.container.resolve<IOrdersKpiService>(
        DI_TOKENS.ORDERS_KPI_SERVICE
      );
      return svc.getRevenueSeries(ctx.user.id, input ?? undefined);
    }),

  getRevenueByCourse: protectedProcedure
    .input(revenueByCourseInput)
    .query(async ({ ctx, input }) => {
      const svc = ctx.container.resolve<IOrdersKpiService>(
        DI_TOKENS.ORDERS_KPI_SERVICE
      );
      return svc.getRevenueByCourse(ctx.user.id, input ?? undefined);
    }),

  getStudentsByCourse: protectedProcedure
    .input(studentsByCourseInput)
    .query(async ({ ctx, input }) => {
      const svc = ctx.container.resolve<IOrdersKpiService>(
        DI_TOKENS.ORDERS_KPI_SERVICE
      );
      return svc.getStudentsByCourse(ctx.user.id, input ?? undefined);
    }),
});

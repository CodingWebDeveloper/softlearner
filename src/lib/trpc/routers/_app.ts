import { initTRPC } from '@trpc/server';
import { courseRouter } from './course-router';

const t = initTRPC.create();

export const appRouter = t.router({
  course: courseRouter,
});

export type AppRouter = typeof appRouter; 
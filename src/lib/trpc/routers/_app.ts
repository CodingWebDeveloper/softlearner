import { initTRPC } from '@trpc/server';
import { coursesRouter } from './courses-router';
import { tagsRouter } from './tags-router';
import { categoriesRouter } from './categories-router';

const t = initTRPC.create();

export const appRouter = t.router({
  courses: coursesRouter,
  tags: tagsRouter,
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter; 
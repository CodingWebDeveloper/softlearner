import { initTRPC } from '@trpc/server';
import { coursesRouter } from './courses-router';
import { tagsRouter } from './tags-router';
import { categoriesRouter } from './categories-router';
import { sectionsRouter } from './sections-router';
import { resourcesRouter } from './resources-router';
import { reviewsRouter } from './reviews-router';

const t = initTRPC.create();

export const appRouter = t.router({
  courses: coursesRouter,
  tags: tagsRouter,
  categories: categoriesRouter,
  sections: sectionsRouter,
  resources: resourcesRouter,
  reviews: reviewsRouter,
});

export type AppRouter = typeof appRouter; 
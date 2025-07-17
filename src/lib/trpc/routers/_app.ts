import { router } from '../server';
import { coursesRouter } from './courses-router';
import { tagsRouter } from './tags-router';
import { categoriesRouter } from './categories-router';
import { resourcesRouter } from './resources-router';
import { reviewsRouter } from './reviews-router';
import { paymentsRouter } from './payments-router';

export const appRouter = router({
  courses: coursesRouter,
  tags: tagsRouter,
  categories: categoriesRouter,
  resources: resourcesRouter,
  reviews: reviewsRouter,
  payments: paymentsRouter,
});

export type AppRouter = typeof appRouter; 
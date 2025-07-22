import { coursesRouter } from "./courses-router";
import { tagsRouter } from "./tags-router";
import { categoriesRouter } from "./categories-router";
import { resourcesRouter } from "./resources-router";
import { reviewsRouter } from "./reviews-router";
import { paymentsRouter } from "./payments-router";
import { votesRouter } from "./votes-router";
import { bookmarksRouter } from "./bookmarks-router";
import { router } from "../trpc";

export const appRouter = router({
  courses: coursesRouter,
  tags: tagsRouter,
  categories: categoriesRouter,
  resources: resourcesRouter,
  reviews: reviewsRouter,
  payments: paymentsRouter,
  votes: votesRouter,
  bookmarks: bookmarksRouter,
});

export type AppRouter = typeof appRouter;

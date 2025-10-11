import { coursesRouter } from "./courses-router";
import { tagsRouter } from "./tags-router";
import { categoriesRouter } from "./categories-router";
import { resourcesRouter } from "./resources-router";
import { reviewsRouter } from "./reviews-router";
import { paymentsRouter } from "./payments-router";
import { votesRouter } from "./votes-router";
import { bookmarksRouter } from "./bookmarks-router";
import { testsRouter } from "./tests-router";
import { usersRouter } from "./users-router";
import { ordersRouter } from "./orders-router";
import { creatorApplicationsRouter } from "./creator-applications-router";
import { ordersKpiRouter } from "./orders-kpi-router";
import { reviewsKpiRouter } from "./reviews-kpi-router";
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
  tests: testsRouter,
  users: usersRouter,
  creatorApplications: creatorApplicationsRouter,
  orders: ordersRouter,
  ordersKpi: ordersKpiRouter,
  reviewsKpi: reviewsKpiRouter,
});

export type AppRouter = typeof appRouter;

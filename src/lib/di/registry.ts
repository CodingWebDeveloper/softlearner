import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { DIContainer } from "./container";

// DAL imports
import { CoursesDAL } from "../dal/courses.dal";
import { CategoriesDAL } from "../dal/categories.dal";
import { TagsDAL } from "../dal/tags.dal";
import { ReviewsDAL } from "../dal/reviews.dal";
import { VotesDAL } from "../dal/votes.dal";
import { ResourcesDAL } from "../dal/resources.dal";
import { OrdersDAL } from "../dal/orders.dal";
import { PaymentsDAL } from "../dal/payments.dal";

// Service imports
import { CategoriesService } from "@/services/categories-service";
import { CoursesService } from "@/services/courses-service";
import { TagsService } from "@/services/tags-service";
import { ResourcesService } from "@/services/resources-service";
import { ReviewsService } from "@/services/reviews-service";
import { VotesService } from "@/services/votes-service";
import { PaymentsService } from "@/services/payments-service";

// Interface imports
import {
  ICoursesDAL,
  ICategoriesDAL,
  ITagsDAL,
  IReviewsDAL,
  IVotesDAL,
  IResourcesDAL,
  IOrdersDAL,
  IPaymentsDAL,
} from "./interfaces/dal.interfaces";

import {
  ICategoriesService,
  ICoursesService,
  ITagsService,
  IResourcesService,
  IReviewsService,
  IVotesService,
  IPaymentsService,
} from "@/services/interfaces/service.interfaces";

// Token constants for dependency injection
export const DI_TOKENS = {
  // DAL tokens
  COURSES_DAL: "COURSES_DAL",
  CATEGORIES_DAL: "CATEGORIES_DAL",
  TAGS_DAL: "TAGS_DAL",
  REVIEWS_DAL: "REVIEWS_DAL",
  VOTES_DAL: "VOTES_DAL",
  RESOURCES_DAL: "RESOURCES_DAL",
  ORDERS_DAL: "ORDERS_DAL",
  PAYMENTS_DAL: "PAYMENTS_DAL",

  // Service tokens
  CATEGORIES_SERVICE: "CATEGORIES_SERVICE",
  COURSES_SERVICE: "COURSES_SERVICE",
  TAGS_SERVICE: "TAGS_SERVICE",
  RESOURCES_SERVICE: "RESOURCES_SERVICE",
  REVIEWS_SERVICE: "REVIEWS_SERVICE",
  VOTES_SERVICE: "VOTES_SERVICE",
  PAYMENTS_SERVICE: "PAYMENTS_SERVICE",

  // Core dependencies
  SUPABASE: "SUPABASE",
} as const;

/**
 * Registers all DALs with the DI container
 */
export function registerDALs(
  container: DIContainer,
  supabase: SupabaseClient<Database>
): void {
  // Register Supabase client
  container.register(DI_TOKENS.SUPABASE, () => supabase);

  // Register DALs
  container.register<ICoursesDAL>(
    DI_TOKENS.COURSES_DAL,
    (c) => new CoursesDAL(c.resolve(DI_TOKENS.SUPABASE))
  );

  container.register<ICategoriesDAL>(
    DI_TOKENS.CATEGORIES_DAL,
    (c) => new CategoriesDAL(c.resolve(DI_TOKENS.SUPABASE))
  );

  container.register<ITagsDAL>(
    DI_TOKENS.TAGS_DAL,
    (c) => new TagsDAL(c.resolve(DI_TOKENS.SUPABASE))
  );

  container.register<IReviewsDAL>(
    DI_TOKENS.REVIEWS_DAL,
    (c) => new ReviewsDAL(c.resolve(DI_TOKENS.SUPABASE))
  );

  container.register<IVotesDAL>(
    DI_TOKENS.VOTES_DAL,
    (c) => new VotesDAL(c.resolve(DI_TOKENS.SUPABASE))
  );

  container.register<IResourcesDAL>(
    DI_TOKENS.RESOURCES_DAL,
    (c) => new ResourcesDAL(c.resolve(DI_TOKENS.SUPABASE))
  );

  container.register<IOrdersDAL>(
    DI_TOKENS.ORDERS_DAL,
    (c) => new OrdersDAL(c.resolve(DI_TOKENS.SUPABASE))
  );

  container.register<IPaymentsDAL>(
    DI_TOKENS.PAYMENTS_DAL,
    (c) => new PaymentsDAL(c.resolve(DI_TOKENS.SUPABASE))
  );
}

/**
 * Registers all services with the DI container
 */
export function registerServices(
  container: DIContainer,
  supabase: SupabaseClient<Database>
): void {
  // First register DALs since services depend on them
  registerDALs(container, supabase);

  // Register services
  container.register<ICategoriesService>(
    DI_TOKENS.CATEGORIES_SERVICE,
    (c) => new CategoriesService(c.resolve(DI_TOKENS.CATEGORIES_DAL))
  );

  container.register<ICoursesService>(
    DI_TOKENS.COURSES_SERVICE,
    (c) => new CoursesService(c.resolve(DI_TOKENS.COURSES_DAL))
  );

  container.register<ITagsService>(
    DI_TOKENS.TAGS_SERVICE,
    (c) => new TagsService(c.resolve(DI_TOKENS.TAGS_DAL))
  );

  container.register<IResourcesService>(
    DI_TOKENS.RESOURCES_SERVICE,
    (c) => new ResourcesService(c.resolve(DI_TOKENS.RESOURCES_DAL))
  );

  container.register<IReviewsService>(
    DI_TOKENS.REVIEWS_SERVICE,
    (c) => new ReviewsService(c.resolve(DI_TOKENS.REVIEWS_DAL))
  );

  container.register<IVotesService>(
    DI_TOKENS.VOTES_SERVICE,
    (c) => new VotesService(c.resolve(DI_TOKENS.VOTES_DAL))
  );

  container.register<IPaymentsService>(
    DI_TOKENS.PAYMENTS_SERVICE,
    (c) => new PaymentsService(c.resolve(DI_TOKENS.PAYMENTS_DAL))
  );
}

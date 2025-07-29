import { initTRPC, TRPCError } from "@trpc/server";
import superjson, { SuperJSONResult } from "superjson";
import { createClient } from "@/lib/supabase/server";
import { ZodError } from "zod";
import { createRequestContainer } from "@/lib/di/container";
import { registerServices } from "@/lib/di/registry";

export const createTRPCContext = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Create a container for this request and register all services
  const container = createRequestContainer(supabase);
  registerServices(container, supabase);
  return {
    user,
    supabase,
    container,
  };
};

const customTransformer = {
  serialize: (data: unknown) => {
    // Don't transform FormData or ArrayBuffer - let them pass through
    if (data instanceof FormData || data instanceof ArrayBuffer) {
      return data;
    }
    return superjson.serialize(data);
  },
  deserialize: (data: unknown) => {
    // FormData and ArrayBuffer come through as-is from client
    if (data instanceof FormData || data instanceof ArrayBuffer) {
      return data;
    }
    return superjson.deserialize(data as SuperJSONResult);
  },
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: customTransformer,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure for authenticated routes
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

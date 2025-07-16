import { initTRPC } from '@trpc/server';
import { TRPCError } from '@trpc/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../database/database.types';

// Create Supabase client for server-side operations
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Context type
export interface Context {
  user?: {
    id: string;
  };
  supabase: typeof supabase;
}

// Initialize tRPC
const t = initTRPC.context<Context>().create();

// Base router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;

// Middleware to check if user is authenticated
const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user?.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in',
    });
  }
  return next({
    ctx: {
      user: ctx.user,
      supabase,
    },
  });
});

// Protected procedure
export const protectedProcedure = t.procedure.use(isAuthed); 
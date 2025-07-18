import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/lib/trpc/routers/_app";
import { createClient } from "@/lib/supabase/server";

const handler = async (req: Request) => {
  const supabase = await createClient();

  // Get the user from Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({
      user: user ? { id: user.id } : undefined,
      supabase,
    }),
  });
};

export { handler as GET, handler as POST };

"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  httpBatchLink,
  httpLink,
  isNonJsonSerializable,
  splitLink,
} from "@trpc/client";
import { trpc } from "@/lib/trpc/client";
import superjson from "superjson";

const URL = "/api/trpc";

interface TrpcProviderProps {
  children: ReactNode;
}

const TrpcProvider = ({ children }: TrpcProviderProps) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        splitLink({
          condition: (op) => isNonJsonSerializable(op.input),
          true: httpLink({
            url: URL,
            transformer: {
              // request - convert data before sending to the tRPC server
              serialize: (data) => data,
              // response - convert the tRPC response before using it in client
              deserialize: superjson.deserialize, // or your other transformer
            },
          }),
          false: httpBatchLink({
            url: URL,
            transformer: superjson,
          }),
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

export default TrpcProvider;

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from './routers/_app';

// Export type-safe client
export const trpc = createTRPCReact<AppRouter>();
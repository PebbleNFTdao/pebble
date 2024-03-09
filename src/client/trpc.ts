import { API_BASE_ENDPOINT, IS_DEV } from "@/config";
import type { AppRouter } from "@/types";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
export const initializeTRPCClient = () =>
  trpc.createClient({
    links: [
      loggerLink({
        enabled: () => IS_DEV,
      }),
      httpBatchLink({
        url: API_BASE_ENDPOINT,
      }),
    ],
  });

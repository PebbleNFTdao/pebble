import { API_BASE_ENDPOINT } from "@/config";
import type { AppRouter } from "@/types";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
export const initializeTRPCClient = () =>
  trpc.createClient({
    links: [
      loggerLink({
        enabled: () => process.env.NODE_ENV === "development",
      }),
      httpBatchLink({
        url: API_BASE_ENDPOINT,
      }),
    ],
  });

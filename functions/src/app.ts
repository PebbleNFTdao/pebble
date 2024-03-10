import * as trpcExpress from "@trpc/server/adapters/express";
import { APP_TITLE, APP_VERSION } from "./constants";
import { collectionRouter } from "./routers/collection";
import { nftRouter } from "./routers/nft";
import { rewardRouter } from "./routers/reward";
import { userRouter } from "./routers/user";
import { logger } from "./utils/logger";
import { publicProcedure, router } from "./utils/trpc";

export const appRouter = router({
  info: publicProcedure.query(async () => {
    return { name: APP_TITLE, version: APP_VERSION };
  }),
  user: userRouter,
  collection: collectionRouter,
  nft: nftRouter,
  reward: rewardRouter,
});

export type AppRouter = typeof appRouter;

export const trpcHandler = trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext: async () => {},
  onError(opts) {
    if (opts.error.code !== "BAD_REQUEST") {
      logger.error(opts.error.code, opts.error);
    }
  },
});

import { onRequest } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { trpcHandler } from "./app";
import { CORS_ORIGIN_URL, IS_DEV, ownerSecretPrivateKey } from "./config";
import { getTokenMetadata } from "./controllers/nft";
import { handlePebbleNFTEvent } from "./services/event";
import { handleSnapshot } from "./services/snapshot";
import { logger } from "./utils/logger";

export const trpc = onRequest(
  {
    cors: IS_DEV ? true : [CORS_ORIGIN_URL.value()],
    timeoutSeconds: 60,
    region: ["us-central1"],
    maxInstances: 3,
    secrets: [ownerSecretPrivateKey],
  },
  (req, res) => {
    trpcHandler(req, res, (error) => {
      if (error) {
        logger.error("An error occurred", error);
        res.status(500).json({ message: "An error occurred" });
      }
    });
  }
);

export const metadata = onRequest(
  { cors: true, timeoutSeconds: 30, region: ["us-central1"], maxInstances: 1 },
  async (req, res) => await getTokenMetadata(req, res)
);

export const batchPebbleNFTEvent = onSchedule(
  {
    schedule: "every 1 minutes",
    concurrency: 1,
    timeoutSeconds: 1200,
    region: "us-central1",
  },
  async (event) => {
    try {
      logger.info(`Processing Pebble NFT event for ${event.jobName}`);
      const { mintedTokenIds, burnedTokenIds } = await handlePebbleNFTEvent();
      logger.info(
        `Minted TokenIds: ${mintedTokenIds}. Burned TokenIds: ${burnedTokenIds}`
      );
    } catch (error) {
      logger.error(
        `Error processing Pebble NFT event for ${event.jobName}`,
        error
      );
    }
  }
);

export const batchSnapshot = onSchedule(
  {
    schedule: "every day 00:30",
    retryCount: 1,
    concurrency: 1,
    timeZone: "UTC",
    timeoutSeconds: 1200,
    region: "us-central1",
  },
  async (event) => {
    try {
      logger.info(`Processing snapshot for ${event.jobName}`);
      await handleSnapshot();
    } catch (error) {
      logger.error(`Error processing snapshot for ${event.jobName}`, error);
    }
  }
);

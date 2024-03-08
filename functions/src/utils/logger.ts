import * as firebaseLogger from "firebase-functions/logger";

export const logger = {
  debug: (...args: any[]) => firebaseLogger.debug(args),
  info: (...args: any[]) => firebaseLogger.info(args),
  warn: (...args: any[]) => firebaseLogger.warn(args),
  error: (...args: any[]) => firebaseLogger.error(args),
  critical: (...args: any[]) => firebaseLogger.error("[CRITICAL]:", args),
};

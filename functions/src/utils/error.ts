import { TRPCError } from "@trpc/server";
import type { Response } from "express";
import type { Request } from "firebase-functions/v2/https";
import { logger } from "./logger";

export const validateRequestMethod = (
  req: Request,
  res: Response,
  allowedMethods: string[]
) => {
  if (allowedMethods.indexOf(req.method) === -1) {
    res.status(405).json({
      message: `Method ${req.method} is not supported. Use GET.`,
    });
    return;
  }
};

export const apiErrorHandler = (error: Error, res: Response) => {
  if (error instanceof TRPCError) {
    if (error.code !== "BAD_REQUEST") {
      logger.error("A trpc error occurred", error);
    }
    res.status(400).json({ message: error.message });
  } else {
    logger.error("An error occurred", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

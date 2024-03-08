import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";
import type { Context } from "../types";

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
  isDev: process.env.NODE_ENV === "development",
});

export const router = t.router;
export const publicProcedure = t.procedure;

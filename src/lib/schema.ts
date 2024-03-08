import { z } from "zod";

export const QuantitySchema = z.object({
  quantity: z.number().min(1).max(10000),
});

export type QuantitySchemaType = z.infer<typeof QuantitySchema>;

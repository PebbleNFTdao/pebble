import { TRPCError } from "@trpc/server";
import { isAddress } from "viem";
import { z } from "zod";

export const addressSchema = z.object({
  address: z
    .string()
    .min(1, { message: "Address cannot be empty" })
    .max(42, { message: "Address cannot exceed 42 characters" })
    .transform((v) => v.toLowerCase())
    .refine((v) => isAddress(v), {
      message: "Invalid Ethereum address",
    }),
});

export const UserSchema = z
  .object({
    points: z.number().int().min(0),
    potions: z.number().int().min(0),
    referralCount: z.number().int().min(0),
    referralCode: z.string().length(6),
    createdAt: z.any(),
    lastPermitBurnNFTAt: z.any().optional(),
  })
  .merge(addressSchema);

export const NFTSchema = z.object({
  tokenId: z.string().min(1).max(10),
  rarity: z.number().int().min(1).max(10),
  imageId: z.number().min(1).max(255),
  isActive: z.boolean(),
  burnableAt: z.any(),
  burnedAt: z.any().optional(),
});

export const EventSchema = z.object({
  lastProcessedBlockNumber: z.string().min(1),
});

export const getMeInput = z
  .object({
    code: z.string().length(6).optional().nullable(),
  })
  .merge(addressSchema);

export const permitBurnNFTInput = z
  .object({
    tokenIds: z.array(z.string().regex(/^\d+$/, "Invalid tokenId format")),
  })
  .merge(addressSchema);

export const tokenMetadataParams = z.object({
  0: z.string().regex(/^\d+$/, "Invalid tokenId"),
});

const zodParseError = (error: Error, msg: string) => {
  const parsed = JSON.parse((error satisfies Error).message) as {
    message: string;
    path: string[];
  }[];
  const errorMsgs = parsed.map(({ message }) => message).join(",");
  throw new TRPCError({
    code: "BAD_REQUEST",
    message: `${msg}: ${errorMsgs}`,
  });
};

export const zodParse = <T>(
  data: FirebaseFirestore.DocumentData | undefined,
  schema: z.ZodSchema<T>
) => {
  try {
    const body = schema.parse(data);
    return body as z.infer<typeof schema>;
  } catch (error) {
    return zodParseError(error as Error, "Validation error:");
  }
};

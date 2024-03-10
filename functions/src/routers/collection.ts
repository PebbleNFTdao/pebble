import { NFTResponse } from "../models/nft";
import { listCollection } from "../services/collection";
import { addressSchema } from "../utils/schema";
import { publicProcedure, router } from "../utils/trpc";

export const collectionRouter = router({
  listCollection: publicProcedure
    .input(addressSchema)
    .query(async ({ input: { address } }) => {
      const collection = await listCollection(address);
      return collection.map((c) => c?.toJSON() as NFTResponse);
    }),
});

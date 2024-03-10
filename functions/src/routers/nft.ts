import { permitBurnNFT } from "../services/nft";
import { permitBurnNFTInput } from "../utils/schema";
import { publicProcedure, router } from "../utils/trpc";

export const nftRouter = router({
  permitBurnNFT: publicProcedure
    .input(permitBurnNFTInput)
    .mutation(({ input }) => permitBurnNFT(input.address, input.tokenIds)),
});

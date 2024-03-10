import { generateNonce, verifySiweSignature } from "../services/reward";
import { addressSchema, verifySiweSignatureInput } from "../utils/schema";
import { publicProcedure, router } from "../utils/trpc";

export const rewardRouter = router({
  generateNonce: publicProcedure
    .input(addressSchema)
    .mutation(async ({ input }) => generateNonce(input.address)),
  verifySiweSignature: publicProcedure
    .input(verifySiweSignatureInput)
    .mutation(async ({ input }) => verifySiweSignature(input)),
});

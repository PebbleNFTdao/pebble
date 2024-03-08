import { getMe } from "../services/user";
import { getMeInput } from "../utils/schema";
import { publicProcedure, router } from "../utils/trpc";

export const userRouter = router({
  getMe: publicProcedure.input(getMeInput).query(async (opts) => {
    const { input } = opts;
    return getMe(input);
  }),
});

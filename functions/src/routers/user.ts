import { UserResponse } from "../models/user";
import { getMe } from "../services/user";
import { getMeInput } from "../utils/schema";
import { publicProcedure, router } from "../utils/trpc";

export const userRouter = router({
  getMe: publicProcedure.input(getMeInput).query(async ({ input }) => {
    const user = await getMe(input);
    return user.toJSON() as UserResponse;
  }),
});

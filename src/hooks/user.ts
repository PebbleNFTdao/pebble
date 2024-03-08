import { trpc } from "@/client/trpc";
import { useAccount } from "wagmi";
import { useQuery } from "./utils";

export const useUserRequest = () => {
  const { address } = useAccount();
  const query = useQuery();

  const { data: user } = trpc.user.getMe.useQuery(
    {
      address: address!,
      ...(query.get("code") && { code: query.get("code") }),
    },
    {
      enabled: !!address,
    }
  );

  return {
    user,
  };
};

import { trpc } from "@/lib/trpc";
import { useAccount } from "wagmi";
import { useQuery } from "./utils";

export const useUserRequest = () => {
  const { address } = useAccount();
  const query = useQuery();

  const { data: user, isLoading } = trpc.user.getMe.useQuery(
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
    loading: isLoading,
  };
};

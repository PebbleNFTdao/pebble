import { trpc } from "@/lib/trpc";
import { displayRejectionMessage } from "@/lib/utils";
import { useState } from "react";
import { SiweMessage } from "siwe";
import { toast } from "sonner";
import { useAccount, useChainId, useSignMessage } from "wagmi";

export const useLoginBonus = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const [loading, setLoading] = useState(false);

  const { mutateAsync: generateNonce } =
    trpc.reward.generateNonce.useMutation();
  const { mutateAsync: verifySiweSignature } =
    trpc.reward.verifySiweSignature.useMutation();

  const claimDailyLoginBonus = async (successCb: () => void) => {
    if (!address) return;
    setLoading(true);

    try {
      const { nonce, nonceToken } = await generateNonce({ address });
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      await verifySiweSignature({
        signature,
        message,
        nonceToken,
      });

      toast.success("Success", {
        description: "You have successfully claimed your daily login bonus.",
        position: "top-right",
      });
      successCb();
    } catch (error) {
      toast.error("Error", {
        description: `${displayRejectionMessage(
          error as Error
        )} Please try again later.`,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    address,
    claimDailyLoginBonus,
    loading,
  };
};

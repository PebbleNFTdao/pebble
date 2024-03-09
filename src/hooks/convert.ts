import ERC20 from "@/abi/ERC20.json";
import PebbleNFT from "@/abi/PebbleNFT.json";
import {
  PEBBLE_NFT_CONTRACT_ADDRESS,
  STAKE_STONE_ETH_CONTRACT_ADDRESS,
} from "@/config";
import { STONE_DECIMALS } from "@/constants";
import { trpc } from "@/lib/trpc";
import { wagmiConfig } from "@/lib/wagmi";
import { getClient } from "@wagmi/core";
import { useState } from "react";
import { formatUnits } from "viem";
import { readContract } from "viem/actions";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

const publicClient = getClient(wagmiConfig)!;

export const useBalance = () => {
  const { address } = useAccount();

  const stoneResult = useReadContract({
    abi: ERC20.abi,
    address: STAKE_STONE_ETH_CONTRACT_ADDRESS,
    functionName: "balanceOf",
    args: [address],
  });

  const pebbleResult = useReadContract({
    abi: ERC20.abi,
    address: PEBBLE_NFT_CONTRACT_ADDRESS,
    functionName: "balanceOf",
    args: [address],
  });

  const stoneBalance = stoneResult?.data
    ? parseFloat(
        formatUnits((stoneResult?.data as bigint) || BigInt(0), STONE_DECIMALS)
      ).toFixed(2)
    : "0.00";

  const pebbleBalance = pebbleResult.data
    ? pebbleResult?.data?.toString()
    : "0";

  return {
    stoneBalance,
    pebbleBalance,
    refetch: () => {
      stoneResult.refetch();
      pebbleResult.refetch();
    },
  };
};

export const useMint = () => {
  const { address } = useAccount();
  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });
  const [loadingText, setLoadingText] = useState("Approving");

  const fetchStoneBalance = async () => {
    const balance = await readContract(publicClient, {
      address: STAKE_STONE_ETH_CONTRACT_ADDRESS,
      abi: ERC20.abi,
      functionName: "balanceOf",
      args: [address],
    });
    return balance as bigint;
  };

  const fetchCurrentAllowance = async () => {
    const allowance = await readContract(publicClient, {
      address: STAKE_STONE_ETH_CONTRACT_ADDRESS,
      abi: ERC20.abi,
      functionName: "allowance",
      args: [address, PEBBLE_NFT_CONTRACT_ADDRESS],
    });
    return allowance as bigint;
  };

  const handleApprove = async (requiredAmount: bigint) => {
    setLoadingText("Approving");
    const res = await writeContractAsync({
      address: STAKE_STONE_ETH_CONTRACT_ADDRESS,
      abi: ERC20.abi,
      functionName: "approve",
      args: [PEBBLE_NFT_CONTRACT_ADDRESS, requiredAmount],
    });
    return res;
  };

  const handleMint = async (quantity: number) => {
    setLoadingText("Minting");
    const res = await writeContractAsync({
      address: PEBBLE_NFT_CONTRACT_ADDRESS,
      abi: PebbleNFT.abi,
      functionName: "batchMint",
      args: [address, BigInt(quantity)],
    });
    return res;
  };

  return {
    fetchStoneBalance,
    fetchCurrentAllowance,
    handleApprove,
    handleMint,
    isPending,
    isConfirming,
    loadingText,
  };
};

export const useBurn = () => {
  const { address } = useAccount();
  const mutation = trpc.nft.permitBurnNFT.useMutation();
  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleBurn = async (tokenIds: string[]) => {
    const data = await mutation.mutateAsync({
      address: address!,
      tokenIds,
    });
    const tokenIdBigints = data.tokenIds.map((id) => BigInt(id));
    await writeContractAsync({
      address: PEBBLE_NFT_CONTRACT_ADDRESS,
      abi: PebbleNFT.abi,
      functionName: "batchBurnWithPermit",
      args: [tokenIdBigints, BigInt(data.expiration), data.signature],
    });
  };

  return {
    handleBurn,
    isPending: mutation.isPending || isPending || isConfirming,
    isSuccess,
  };
};

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PEBBLE_RATE, STONE_DECIMALS } from "@/config";
import { TabAction } from "@/enums";
import { useBalance, useMint } from "@/hooks/convert";
import { QuantitySchema, type QuantitySchemaType } from "@/lib/schema";
import { useBurnStore } from "@/stores/burn";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { inferRouterOutputs } from "@trpc/server";
import { useCallback, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { parseUnits } from "viem";
import { useAccount } from "wagmi";
import type { AppRouter } from "../../../functions/src/app";
import { StoneIcon } from "../icon/stone";
import PebbleSelectionDialog from "./pebble-selection-dialog";

type RouterOutput = inferRouterOutputs<AppRouter>;

interface Props {
  title: string;
  description: string;
  label: string;
  resultPrefix: string;
  action: TabAction;
  user: RouterOutput["user"]["getMe"] | undefined;
}

export default function TokenConvert({
  title,
  description,
  label,
  resultPrefix,
  action,
  user,
}: Props) {
  const { address } = useAccount();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<QuantitySchemaType>({ resolver: zodResolver(QuantitySchema) });
  const {
    fetchStoneBalance,
    fetchCurrentAllowance,
    handleApprove,
    handleMint,
    isPending,
    isConfirming,
    loadingText,
  } = useMint();
  const { stoneBalance, pebbleBalance, refetch } = useBalance();
  const [total, setTotal] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const setBurnNTFcount = useBurnStore((state) => state.setBurnNTFcount);
  const setDisplayPotion = useBurnStore((state) => state.setDisplayPotion);

  const calculateTotal = useCallback((value: number) => {
    const result = value * PEBBLE_RATE;
    return Number(result.toFixed(2));
  }, []);
  const quantity = watch("quantity", 0);
  const loading = isPending || isConfirming || isSubmitting;

  useEffect(() => {
    if (Number.isNaN(quantity)) return setTotal(0);
    setTotal(calculateTotal(quantity));
  }, [quantity, setTotal, calculateTotal]);

  const onSubmit: SubmitHandler<QuantitySchemaType> = async ({ quantity }) => {
    try {
      if (action === TabAction.Crush) {
        const stoneBalance = await fetchStoneBalance();
        const currentAllowanceAmount = await fetchCurrentAllowance();
        const stoneAmount = String(quantity * PEBBLE_RATE);
        const requiredAmount = parseUnits(stoneAmount, STONE_DECIMALS);
        if (requiredAmount > stoneBalance) {
          setError("quantity", { message: "You don't have enough STONE" });
          return;
        }
        if (requiredAmount > currentAllowanceAmount) {
          await handleApprove(requiredAmount);
          toast.success("Approved successful", {
            description: `Approval completed successfully for ${stoneAmount} Pebbles. Please mint your Pebbles.`,
            position: "top-right",
          });
          return;
        }

        await handleMint(quantity);
        toast.success("Mint completed successfully", {
          description: `You minted ${quantity} Pebbles. They will appear in your collection within a few minutes.`,
          position: "top-right",
        });
        refetch();
        return;
      }
      if (quantity > Number(pebbleBalance)) {
        setError("quantity", { message: "You don't have enough Pebbles" });
        return;
      }

      setDisplayPotion(Number(user?.potions));
      setBurnNTFcount(quantity);
      setIsDialogOpen(true);
    } catch (error) {
      toast.error("Error", {
        description:
          "An error occurred while processing your request. Please try again later.",
        position: "top-right",
      });
    }
  };

  return (
    <Card className="w-full max-w-3xl p-0">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="px-6 pt-6 pb-4">
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="flex items-start space-x-4">
            <div className="w-1/2">
              <Label htmlFor="quantity" className="text-sm md:text-base">
                {label}
              </Label>
              <Input
                id="quantity"
                type="number"
                className="text-base mt-1"
                amount={
                  address
                    ? action === TabAction.Crush
                      ? stoneBalance.toString()
                      : pebbleBalance
                    : undefined
                }
                {...register("quantity", { valueAsNumber: true })}
              />
              {errors.quantity && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.quantity.message}
                </p>
              )}
            </div>
            <div className="w-1/2">
              <Label className="text-sm md:text-base">{resultPrefix}</Label>
              <div className="flex items-center space-x-1 flex-row pt-1.5">
                <span className="text-lg md:text-2xl font-semibold">
                  {total}
                </span>
                <span className="flex items-center">
                  <StoneIcon />
                  STONE
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-6 py-2">
          {address && (
            <Button
              type="submit"
              className="w-full"
              variant={action === "Crush" ? "default" : "secondary"}
              disabled={loading}
            >
              {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
              {isConfirming ? loadingText : action}
            </Button>
          )}
          {!address && (
            <div className="flex flex-col w-full items-center space-y-2 mb-2">
              <h5 className="text-md">Please, connect your wallet</h5>
              <ConnectButton />
            </div>
          )}
        </CardFooter>
      </form>
      <PebbleSelectionDialog
        open={isDialogOpen}
        onClose={setIsDialogOpen}
        refetch={refetch}
      />
    </Card>
  );
}

import { trpc } from "@/client/trpc";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBurn } from "@/hooks/convert";
import { extractAndSetAttributes, sortColleciton } from "@/lib/helpers";
import { useBurnStore } from "@/stores/burn";
import {
  useCallback,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import { GiRoundBottomFlask } from "react-icons/gi";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { CollectionGrid } from "../collection";

type Props = {
  open: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  refetch: () => void;
};

export default function PebbleSelectionDialog({
  open,
  onClose,
  refetch,
}: Props) {
  const { address, isConnected } = useAccount();
  const burnNFTcount = useBurnStore((state) => state.burnNTFcount);
  const displayPotion = useBurnStore((state) => state.displayPotion);
  const chooseNFTTokenIds = useBurnStore((state) => state.chooseNFTTokenIds);
  const reset = useBurnStore((state) => state.reset);
  const { handleBurn, isPending, isSuccess } = useBurn();

  const { data } = trpc.collection.listCollection.useQuery(
    { address: address! },
    {
      enabled: isConnected,
    }
  );

  const collection = extractAndSetAttributes(data ?? []).sort(sortColleciton);

  const handleClose = useCallback(() => {
    onClose(false);
    reset();
  }, [onClose, reset]);

  const handleSubmit = async () => {
    try {
      await handleBurn(chooseNFTTokenIds);
      refetch();
    } catch (error) {
      toast.error("Error", {
        description: `${(error as Error).message} Please try again later.`,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Success", {
        description: "Your Pebbles have been restored.",
        position: "top-right",
      });
      handleClose();
    }
  }, [isSuccess, handleClose]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[350px] md:max-w-[800px] max-h-[600px] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Choose {burnNFTcount} your Pebbles</DialogTitle>
          <DialogDescription>
            Choose the amount of Pebbles you want to mint.
          </DialogDescription>
          <div className="flex">
            <GiRoundBottomFlask className="w-6 h-6" />
            <span>x {displayPotion}</span>
          </div>
        </DialogHeader>
        <CollectionGrid collection={collection} selectable />
        <DialogFooter>
          <Button
            type="button"
            disabled={burnNFTcount !== chooseNFTTokenIds.length || isPending}
            onClick={handleSubmit}
          >
            {isPending ? "Restoring" : "Restore"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { getRestorability } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { useBurnStore } from "@/stores/burn";
import type { NFTType } from "@/types";
import { toast } from "sonner";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  nft: NFTType;
  aspectRatio?: "portrait" | "square";
  selectable?: boolean;
}

export default function NFT({
  nft,
  aspectRatio = "portrait",
  selectable = false,
  className,
  ...props
}: Props) {
  const chooseNFTTokenIds = useBurnStore((state) => state.chooseNFTTokenIds);
  const burnNFTcount = useBurnStore((state) => state.burnNTFcount);
  const displayPotion = useBurnStore((state) => state.displayPotion);
  const incrementPotion = useBurnStore((state) => state.incrementPotion);
  const decrementPotion = useBurnStore((state) => state.decrementPotion);
  const setChooseNFTTokenIds = useBurnStore(
    (state) => state.setChooseNFTTokenIds
  );

  const restorability = getRestorability(nft.burnableAt);
  const isSelected = chooseNFTTokenIds.includes(nft.tokenId);

  const toggleSelection = () => {
    if (!selectable) return;

    if (isSelected) {
      setChooseNFTTokenIds(
        chooseNFTTokenIds.filter((id) => id !== nft.tokenId)
      );
      if (restorability !== "Restorable") {
        incrementPotion();
      }
      return;
    }

    if (burnNFTcount <= chooseNFTTokenIds.length) {
      toast.error("Error", {
        description: "You exeeded the pickup number of NFTs to restore.",
        position: "top-right",
      });
      return;
    }

    if (restorability !== "Restorable") {
      if (displayPotion <= 0) {
        toast.error("Error", {
          description: "You don't have enough potions to burn this NFT.",
          position: "top-right",
        });
        return;
      }
      decrementPotion();
    }

    setChooseNFTTokenIds([...chooseNFTTokenIds, nft.tokenId]);
  };

  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="overflow-hidden rounded-md" onClick={toggleSelection}>
        <img
          src={nft.image}
          alt={nft.name}
          width={250}
          height={330}
          className={cn(
            "h-auto w-auto object-cover transition-all",
            selectable ? "cursor-pointer" : "hover:scale-105",
            isSelected ? "border-4 border-blue-500 rounded-md" : "",
            aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
          )}
        />
      </div>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{nft.name}</h3>
        <p className="text-xs text-muted-foreground">
          Rarity {nft.rarity} / {restorability}
        </p>
      </div>
    </div>
  );
}

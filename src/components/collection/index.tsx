import { Button } from "@/components/ui/button";
import type { NFTType } from "@/types";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "react-router-dom";
import NFT from "./nft";

export function CollectionEmptyPrompt() {
  return (
    <section className="flex flex-col items-center space-y-4 mt-10">
      <h2 className="text-xl md:text-2xl font-semibold">
        You don&apos;t have any pebbles yet
      </h2>
      <p className="text-center text-sm md:text-lg">
        Start by minting your first pebble to see it here.
      </p>
      <Link to="/" aria-label="Mint your first Pebble">
        <Button>Mint Pebble</Button>
      </Link>
    </section>
  );
}

export function WalletConnectPrompt() {
  return (
    <section className="flex flex-col items-center space-y-4 mt-2 w-full">
      <h2 className="text-xl md:text-2xl font-medium">
        Please, connect your wallet
      </h2>
      <p className="text-center text-sm md:text-lg">
        Connect your wallet to see the collection.
      </p>
      <ConnectButton />
    </section>
  );
}

export function CollectionHeader({
  totalStakeStoneEth,
}: {
  totalStakeStoneEth: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex w-full">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Your Collections</h2>
          <p className="text-sm text-gray-600">
            Explore and expand your collection. Add new pebbles and enrich your
            collection.
          </p>
        </div>
        <span className="ml-auto pt-2 text-pink-400 text-sm md:text-xl">
          ≈ {totalStakeStoneEth} StakeStone ETH
        </span>
      </div>
    </div>
  );
}

export function CollectionGrid({
  collection,
  selectable = false,
}: {
  collection: NFTType[];
  selectable?: boolean;
}) {
  return (
    <div className="relative">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-4">
        {collection.map((nft) => (
          <NFT
            key={nft.tokenId}
            nft={nft}
            className="w-full"
            aspectRatio="portrait"
            selectable={selectable}
          />
        ))}
      </div>
    </div>
  );
}

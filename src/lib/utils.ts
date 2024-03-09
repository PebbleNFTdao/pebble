import type { NFTType, RouterOutput } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { formatDistance } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractAndSetAttributes = (
  collection: RouterOutput["collection"]["listCollection"]
) => {
  return collection.map((nft) => {
    const attributes = nft.attributes as Record<string, string>[];
    const rarityAttribute = attributes.find(
      (attribute) => attribute.trait_type === "rarity"
    );
    const burnableAtAttribute = attributes.find(
      (attribute) => attribute.trait_type === "burnableAt"
    );
    if (rarityAttribute) {
      nft.rarity = rarityAttribute.value;
    }
    if (burnableAtAttribute) {
      nft.burnableAt = burnableAtAttribute.value;
    }
    return nft as unknown as NFTType;
  });
};

export const sortColleciton = (a: NFTType, b: NFTType) => {
  return Number(b.rarity) - Number(a.rarity);
};

export const getRestorability = (burnableAt: string): string => {
  const burnableDate = new Date(burnableAt);
  const now = new Date();
  if (now > burnableDate) {
    return "Restorable";
  }
  const relativeTime = formatDistance(burnableDate, now, {
    addSuffix: true,
  });
  return `Restorable ${relativeTime}`;
};

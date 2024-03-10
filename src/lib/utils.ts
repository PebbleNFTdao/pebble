import type { Collection, NFTType } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { formatDistance } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractAndSetAttributes = (collection: Collection) => {
  return collection.map((item) => {
    const nft = { ...item } as unknown as NFTType;
    const rarityAttribute = item.attributes.find(
      (attribute) => attribute.trait_type === "rarity"
    );
    if (rarityAttribute) {
      nft.rarity = rarityAttribute.value;
    }

    const burnableAtAttribute = item.attributes.find(
      (attribute) => attribute.trait_type === "burnableAt"
    );
    if (burnableAtAttribute) {
      nft.burnableAt = burnableAtAttribute.value;
    }

    return nft;
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

export const isBeforeToday = (date: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
};

export const displayRejectionMessage = (error: Error) => {
  const defaultMessage = (error as Error).message;
  if (
    error instanceof Error &&
    error.message.includes("User rejected the request.")
  ) {
    return "You rejected the request.";
  }
  return defaultMessage;
};

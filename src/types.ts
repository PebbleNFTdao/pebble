import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../functions/src/app";
export type { AppRouter };
export interface NFTType {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  rarity: string;
  burnableAt: string;
}
export type RouterOutput = inferRouterOutputs<AppRouter>;

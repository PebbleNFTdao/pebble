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

type RouterOutput = inferRouterOutputs<AppRouter>;
export type User = RouterOutput["user"]["getMe"];
export type Collection = RouterOutput["collection"]["listCollection"];

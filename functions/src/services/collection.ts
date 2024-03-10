import { NFT } from "../models/nft";
import { getOwnedTokenIds } from "../utils/blockchain";
import { getNFTData } from "./nft";

export const listCollection = async (address: string) => {
  const tokenIds = (await getOwnedTokenIds(address)).map((t) => t.toString());
  const promises = [];
  for (const tokenId of tokenIds) {
    promises.push(getNFTData(tokenId, false, false));
  }
  const collection = await Promise.all(promises);
  return collection.filter((t) => t && t.isActive) as NFT[];
};

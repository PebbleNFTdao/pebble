import { z } from "zod";
import { BASE_IMAGE_URL } from "../config";
import * as PebbleNFTInfos from "../data/pebble_nft_infos.json";
import type { Attribute } from "../types";
import { NFTSchema } from "../utils/schema";
import { BaseModel } from "./base";

export class NFT extends BaseModel {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  attributes: Attribute[];

  privateFields = [];

  constructor(nftData: z.infer<typeof NFTSchema>) {
    super();
    const { name, description, image } = this.getMetadataByImageId(
      nftData.imageId
    );
    const burnableAt = nftData.burnableAt.toDate();
    const attributes = this.getAttributes(nftData.rarity, burnableAt);

    this.tokenId = nftData.tokenId;
    this.name = name;
    this.description = description;
    this.image = image;
    this.attributes = attributes;
    this.isActive = nftData.isActive;
  }

  private getMetadataByImageId(imageId: number) {
    const nftInfo = PebbleNFTInfos[imageId - 1];
    return {
      name: nftInfo.name,
      description: nftInfo.description,
      image: `${BASE_IMAGE_URL.value()}/${imageId}.png?alt=media`,
    };
  }

  private getAttributes(rarity: number, burnableAt: Date) {
    return [
      {
        trait_type: "rarity",
        value: String(rarity),
      },
      {
        trait_type: "burnableAt",
        value: burnableAt.toISOString(),
      },
    ];
  }
}

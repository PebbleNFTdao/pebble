import { FieldValue } from "@google-cloud/firestore";
import { TRPCError } from "@trpc/server";
import { RANDOM_PROBABILITIES } from "../constants";
import * as PebbleNFTInfos from "../data/pebble_nft_infos.json";
import { NFT } from "../models/nft";
import { User } from "../models/user";
import { signMessageByOwner } from "../utils/blockchain";
import { nftCollection, userCollection } from "../utils/db";
import { db } from "../utils/firebase";
import { getBurnableDate } from "../utils/helpers";
import { logger } from "../utils/logger";
import { NFTSchema, UserSchema, zodParse } from "../utils/schema";
import { listCollection } from "./collection";

export const saveNFTData = async (tokenIds: string[]) => {
  const batch = db.batch();

  const promises = [];
  const mintedTokenIds = [];
  for (const tokenId of tokenIds) {
    const nftRef = nftCollection.doc(tokenId);
    const doc = await nftRef.get();
    if (doc.exists) {
      logger.info(`Save NFT with tokenId "${tokenId}" already exists`);
      continue;
    }
    const rarity = generateRarity();
    const imageId = getRandomIndex(PebbleNFTInfos);

    promises.push(
      batch.set(nftRef, {
        rarity,
        imageId,
        isActive: true,
        burnableAt: getBurnableDate(),
      })
    );

    mintedTokenIds.push(tokenId);
  }
  if (mintedTokenIds.length > 0) {
    await batch.commit();
  }

  return mintedTokenIds;
};

export const burnNFTData = async (
  burnedTokenData: {
    tokenId: string;
    address: string;
  }[]
) => {
  const batch = db.batch();

  const burnedTokenIds = [];
  for (const { tokenId, address } of burnedTokenData) {
    const nftRef = nftCollection.doc(tokenId);
    const nftDoc = await nftRef.get();
    if (!nftDoc.exists) {
      logger.critical(`Burn NFT with tokenId "${tokenId}" not found`);
      continue;
    }
    const nftData = nftDoc.data()!;
    if (!nftData.isActive) {
      logger.critical(`Burn NFT with tokenId "${tokenId}" is not active`);
      continue;
    }

    batch.update(nftRef, {
      isActive: false,
      burnedAt: FieldValue.serverTimestamp(),
    });

    const userRef = userCollection.doc(address);
    const userDoc = await userRef.get();
    const { potions } = userDoc.data()!;
    if (potions && potions > 0) {
      batch.update(userRef, {
        potions: potions - 1,
      });
    }

    burnedTokenIds.push(tokenId);
  }

  if (burnedTokenIds.length > 0) {
    await batch.commit();
  }

  return burnedTokenIds;
};

const generateRarity = () => {
  const randomNum = Math.random() * 100;
  let cumulativeProbability = 0;
  for (let i = 0; i < RANDOM_PROBABILITIES.length; i++) {
    cumulativeProbability += RANDOM_PROBABILITIES[i];
    if (randomNum <= cumulativeProbability) {
      return i + 1;
    }
  }
  return RANDOM_PROBABILITIES.length + 1;
};

const getRandomIndex = (arr: typeof PebbleNFTInfos) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return randomIndex;
};

export const getNFTData = async (
  tokenId: string,
  throwErrorIfNotFound: boolean = true,
  throwErrorIfBurned: boolean = true
) => {
  const doc = await nftCollection.doc(tokenId).get();
  if (!doc.exists) {
    if (throwErrorIfNotFound) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `NFT with tokenId "${tokenId}" not found.`,
      });
    } else {
      return null;
    }
  }
  const data = zodParse({ ...doc.data(), tokenId }, NFTSchema);
  const nft = new NFT(data);
  if (!nft.isActive && throwErrorIfBurned) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `NFT with tokenId "${tokenId}" has been burned.`,
    });
  }
  return nft;
};

export const permitBurnNFT = async (address: string, tokenIds: string[]) => {
  const isValid = await checkLastPermitBurnNFTAt(address);
  if (!isValid) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message:
        "The last permitted time to burn NFTs has not yet elapsed. Please wait for 3 minutes after confirming your action, regardless of whether you approve or reject.",
    });
  }

  const collection = await listCollection(address);
  const burnNFTs = collection.filter((nft) => tokenIds.includes(nft.tokenId));
  if (burnNFTs.length !== tokenIds.length) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "One or more tokenIds are invalid or do not exist.",
    });
  }

  let needPotionCount = 0;
  for (const nft of burnNFTs) {
    const burnableAt = new Date(nft.attributes[1].value);
    if (burnableAt > new Date()) {
      needPotionCount += 1;
    }
  }

  const ref = userCollection.doc(address);
  const doc = await ref.get();
  const user = zodParse({ address, ...doc.data() }, UserSchema);
  if (user.potions && needPotionCount > user.potions) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Not enough potions to permit the burn of NFTs.",
    });
  }

  await ref.update({ lastPermitBurnNFTAt: FieldValue.serverTimestamp() });

  const signResult = await signMessageByOwner(
    address as `0x${string}`,
    tokenIds
  );
  return signResult;
};

const checkLastPermitBurnNFTAt = async (address: string) => {
  const userRef = userCollection.doc(address);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found.",
    });
  }
  const data = zodParse({ address, ...userDoc.data() }, UserSchema);
  const user = new User(data);
  if (!user.lastPermitBurnNFTAt) {
    return true;
  }

  const threeMinutes = 1000 * 60 * 3;
  return (
    user.lastPermitBurnNFTAt.getTime() + threeMinutes < new Date().getTime()
  );
};

export const getInActiveTokenIds = async () => {
  const inActiveNFTQuery = nftCollection.where("isActive", "==", false);
  const querySnapshot = await inActiveNFTQuery.get();
  const inActiveTokenIds: string[] = [];
  querySnapshot.forEach((doc) => {
    inActiveTokenIds.push(doc.id);
  });
  return inActiveTokenIds;
};

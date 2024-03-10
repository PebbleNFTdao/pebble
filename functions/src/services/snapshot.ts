import { FieldValue } from "@google-cloud/firestore";
import { RARITY_BASE_POINT } from "../constants";
import { User } from "../models/user";
import { getOwnerOf, getTotalSupply } from "../utils/blockchain";
import { publicClient } from "../utils/client";
import { nftCollection, userCollection } from "../utils/db";
import { formatDate } from "../utils/helpers";
import { logger } from "../utils/logger";
import { UserSchema, zodParse } from "../utils/schema";
import { listCollection } from "./collection";
import { getInActiveTokenIds } from "./nft";
import { initializeUserInSnapshot } from "./user";

type OwnerPoint = {
  address: string;
  points: number;
};

export const handleSnapshot = async () => {
  const inActiveTokenIds = await getInActiveTokenIds();

  const blockNumber = await publicClient.getBlockNumber();
  const totalSupply = await getTotalSupply(blockNumber);

  const promises = [];
  const burnedTokenIds: string[] = [];
  for (let i = 0; i < Number(totalSupply) + inActiveTokenIds.length; i++) {
    promises.push(
      (async () => {
        try {
          if (inActiveTokenIds.includes(String(i))) return null;
          return await getOwnerOf(BigInt(i), blockNumber);
        } catch (error) {
          if (
            (error as Error).message.includes(
              'The contract function "ownerOf" reverted'
            )
          ) {
            burnedTokenIds.push(String(i));
            return null;
          }

          logger.critical(
            `Error in getOwnerOf tokenId ${i} form contract`,
            error
          );
          return null;
        }
      })()
    );
  }
  const ownerAddresses = await Promise.all(promises);
  const uniqueOwnerAddresses = [
    ...new Set(ownerAddresses.filter((address) => address !== null)),
  ] as string[];

  const ownerPoints = [];
  for (let i = 0; i < uniqueOwnerAddresses.length; i++) {
    const address = uniqueOwnerAddresses[i];
    const collection = await listCollection(address);

    ownerPoints.push({
      address,
      points: collection
        .map((t) => Number(t.attributes[0].value) * RARITY_BASE_POINT)
        .reduce((a, b) => a + b, 0),
    });
  }

  await saveBatchSnapshot(ownerPoints, burnedTokenIds);

  return { totalAddress: uniqueOwnerAddresses.length };
};

const saveBatchSnapshot = async (
  ownerPoints: OwnerPoint[],
  burnedTokenIds: string[]
) => {
  const snapshotDate = formatDate(new Date());
  const batch = userCollection.firestore.batch();

  const userPromises = ownerPoints.map(async ({ address, points }) => {
    const userRef = userCollection.doc(address.toLowerCase());
    const userDoc = await userRef.get();
    return { userDoc, userRef, points };
  });

  const nftPromises = burnedTokenIds.map(async (tokenId) => {
    const nftRef = nftCollection.doc(tokenId);
    const nftDoc = await nftRef.get();
    return { nftDoc, nftRef };
  });

  const userDocs = await Promise.all(userPromises);
  const nftDocs = await Promise.all(nftPromises);

  userDocs.forEach(({ userDoc, userRef, points }) => {
    if (!userDoc.exists) {
      initializeUserInSnapshot(batch, userRef.id, points, snapshotDate);
    } else {
      const data = zodParse(
        { address: userRef.id, ...userDoc.data() },
        UserSchema
      );
      const user = new User(data);
      const totalPoints = user.points + points;
      batch.update(userRef, { points: totalPoints });
      const dailySnapshotRef = userRef
        .collection("dailySnapshot")
        .doc(snapshotDate);
      batch.set(dailySnapshotRef, { points });
    }
  });

  nftDocs.forEach(({ nftDoc, nftRef }) => {
    if (nftDoc.exists) {
      batch.update(nftRef, {
        isActive: false,
        burnedAt: FieldValue.serverTimestamp(),
      });
    }
  });

  return batch.commit();
};

export const getReferrals = async (address: string) => {
  const ref = userCollection.doc(address).collection("referrals");
  const querySnapshots = await ref.get();
  if (querySnapshots.empty) return [];
  const referrals: FirebaseFirestore.DocumentData[] = [];
  querySnapshots.forEach((doc) => {
    const data = doc.data();
    referrals.push(data);
  });
  return referrals;
};

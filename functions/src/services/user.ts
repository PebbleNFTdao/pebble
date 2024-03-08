import { FieldValue } from "@google-cloud/firestore";
import { z } from "zod";
import { INITIAL_POINT, INITIAL_POTION } from "../config";
import { User } from "../models/user";
import { userCollection } from "../utils/db";
import { db } from "../utils/firebase";
import { generateRandomCode } from "../utils/helpers";
import { UserSchema, getMeInput, zodParse } from "../utils/schema";

export const getMe = async ({ address, code }: z.infer<typeof getMeInput>) => {
  const docRef = userCollection.doc(address);
  const doc = await docRef.get();
  if (!doc.exists) {
    return await initializeUserData(docRef, code);
  }
  const data = zodParse({ address, ...doc.data() }, UserSchema);
  const user = new User(data);
  return user.toJSON();
};

export const initializeUserData = async (
  docRef: FirebaseFirestore.DocumentReference,
  code?: string | null
) => {
  const referralCode = generateRandomCode();
  const initialData = {
    points: INITIAL_POINT,
    potions: INITIAL_POTION,
    referralCode,
    referralCount: 0,
    createdAt: FieldValue.serverTimestamp(),
  };

  await db.runTransaction(async (t) => {
    if (code) {
      const referralCodeQuery = userCollection.where(
        "referralCode",
        "==",
        code
      );
      const querySnapshot = await t.get(referralCodeQuery);

      if (!querySnapshot.empty) {
        const referredUser = querySnapshot.docs[0];
        const newReferralDocRef = referredUser.ref
          .collection("referrals")
          .doc();

        t.set(newReferralDocRef, {
          address: docRef.id,
          referredAt: FieldValue.serverTimestamp(),
        });

        t.update(referredUser.ref, {
          referralCount: FieldValue.increment(1),
          potions: FieldValue.increment(1),
        });
      }
    }

    t.set(docRef, initialData);
  });

  return initialData;
};

export const initializeUserInSnapshot = async (
  batch: FirebaseFirestore.WriteBatch,
  address: string,
  points: number,
  snapshotDate: string
) => {
  const referralCode = generateRandomCode();
  const initialData = {
    points: points,
    potions: INITIAL_POTION,
    referralCode,
    referralCount: 0,
    createdAt: FieldValue.serverTimestamp(),
  };
  const ref = userCollection.doc(address);
  batch.set(ref, initialData);

  const dailySnapshotRef = ref.collection("dailySnapshot").doc(snapshotDate);
  batch.set(dailySnapshotRef, { points });
};

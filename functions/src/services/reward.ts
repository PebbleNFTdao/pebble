import { FieldValue } from "@google-cloud/firestore";
import { TRPCError } from "@trpc/server";
import * as jwt from "jsonwebtoken";
import { SiweMessage } from "siwe";
import { z } from "zod";
import { JWT_TOKEN_SECRET } from "../config";
import { userCollection } from "../utils/db";
import { generateRandomString } from "../utils/helpers";
import {
  UserSchema,
  verifySiweSignatureInput,
  zodParse,
} from "../utils/schema";
import { getMe } from "./user";

type NonceTokenPayload = {
  address: string;
  nonce: string;
};

export const generateNonce = async (address: string) => {
  const user = await getMe({ address });
  if (user.lastDailyBonusAt && !checkLastLoginBonus(user.lastDailyBonusAt)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "You have already claimed your bonus today.",
    });
  }
  const nonce = generateRandomString(8);
  const nonceToken = generateJWTToken({ address, nonce });
  return {
    nonce,
    nonceToken,
  };
};

const checkLastLoginBonus = (lastDailyBonusAt: Date) => {
  const lastBonusDay = lastDailyBonusAt.toISOString().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);
  return lastBonusDay < today;
};

export const verifySiweSignature = async (
  input: z.infer<typeof verifySiweSignatureInput>
) => {
  const { message, signature, nonceToken } = input;
  const { address: decodedAddress, nonce: decodedNonce } =
    verifyJWTToken<NonceTokenPayload>(nonceToken);

  const siweMessage = new SiweMessage(message);
  const {
    success,
    data: { nonce, address },
  } = await siweMessage.verify({ signature }, { suppressExceptions: true });
  if (
    !success ||
    decodedAddress !== address.toLocaleLowerCase() ||
    decodedNonce !== nonce
  ) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message:
        "Failed to verify signature. Please make sure your signature is valid.",
    });
  }

  await dailyBonusRedemption(decodedAddress);

  return {
    success: true,
  };
};

const dailyBonusRedemption = async (address: string) => {
  const userRef = userCollection.doc(address);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User does not exist",
    });
  }
  const data = zodParse({ address, ...userDoc.data() }, UserSchema);

  await userRef.update({
    potions: FieldValue.increment(1),
    lastDailyBonusAt: FieldValue.serverTimestamp(),
    dailyBonusCount: data.dailyBonusCount ? FieldValue.increment(1) : 1,
  });
};

const generateJWTToken = (
  payload: Record<string, string>,
  expiresIn = "60s"
) => {
  const token = jwt.sign(payload, JWT_TOKEN_SECRET.value(), { expiresIn });
  return token;
};

const verifyJWTToken = <T>(token: string): T => {
  try {
    const decoded = jwt.verify(token, JWT_TOKEN_SECRET.value());
    return decoded as T;
  } catch {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Failed to verify token. Please make sure your token is valid.",
    });
  }
};

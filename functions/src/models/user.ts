import { z } from "zod";
import { UserSchema } from "../utils/schema";
import { BaseModel } from "./base";

export type UserResponse = Omit<User, "privateFields" | "toJSON" | "createdAt">;

export class User extends BaseModel<User> {
  address: string;
  points: number;
  potions: number;
  referralCount: number;
  referralCode: string;
  createdAt: Date | null;
  lastPermitBurnNFTAt: Date | null;
  lastDailyBonusAt: Date | null;
  dailyBonusCount: number | null;

  privateFields = [
    "createdAt",
    "dailyBonusCount",
    "lastDailyBonusAt",
    "lastPermitBurnNFTAt",
  ];

  constructor(userData: z.infer<typeof UserSchema>) {
    super();
    this.address = userData.address;
    this.points = userData.points;
    this.potions = userData.potions;
    this.referralCount = userData.referralCount;
    this.referralCode = userData.referralCode;
    this.createdAt = userData.createdAt.toDate();
    this.lastPermitBurnNFTAt = userData.lastPermitBurnNFTAt
      ? userData.lastPermitBurnNFTAt.toDate()
      : null;
    this.lastDailyBonusAt = userData.lastDailyBonusAt
      ? userData.lastDailyBonusAt.toDate()
      : null;
    this.dailyBonusCount = userData.dailyBonusCount
      ? userData.dailyBonusCount
      : null;
  }
}

import { z } from "zod";
import { UserSchema } from "../utils/schema";
import { BaseModel } from "./base";

export class User extends BaseModel {
  address: string;
  points: number;
  potions: number;
  referralCount: number;
  referralCode: string;
  createdAt?: Date;
  lastPermitBurnNFTAt?: Date;

  privateFields = ["createdAt"];

  constructor(userData: z.infer<typeof UserSchema>) {
    super();
    this.address = userData.address;
    this.points = userData.points;
    this.potions = userData.potions;
    this.referralCount = userData.referralCount;
    this.referralCode = userData.referralCode;
    this.createdAt = userData.createdAt.toDate();
    this.lastPermitBurnNFTAt = userData.lastPermitBurnNFTAt;
  }
}

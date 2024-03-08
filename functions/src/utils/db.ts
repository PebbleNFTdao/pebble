import { db } from "./firebase";

export const userCollection = db.collection("users");
export const nftCollection = db.collection("nfts");
export const eventCollection = db.collection("events");

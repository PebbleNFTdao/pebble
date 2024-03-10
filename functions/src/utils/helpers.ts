import { Timestamp } from "@google-cloud/firestore";
import * as crypto from "node:crypto";
import { MAX_AGE_DAYS } from "../constants";

export const generateRandomString = (byteLength: number) => {
  return crypto.randomBytes(byteLength).toString("hex");
};

export const generateRandomCode = () => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const getBurnableDate = () => {
  const now = new Date();
  const burnableDays = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  const burnableAt = Timestamp.fromDate(new Date(now.getTime() + burnableDays));
  return burnableAt;
};

export const formatDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

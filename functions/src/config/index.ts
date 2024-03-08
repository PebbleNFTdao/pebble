import { defineSecret, defineString } from "firebase-functions/params";

const NODE_ENV = defineString("NODE_ENV", {
  description:
    "The current environment in which the application is running. Common values are development, production, and test.",
  default: "development",
  input: {
    select: { options: [{ value: "development" }, { value: "production" }] },
  },
});

export const CORS_ORIGIN_URL = defineString("CORS_ORIGIN_URL", {
  description:
    "URL of the origin that is permitted to access the application under the CORS policy.",
  default: "http://localhost:5173",
  input: {
    text: {
      validationRegex:
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      validationErrorMessage: "Must be a valid URL.",
    },
  },
});

export const SEPOLIA_RPC_URL = defineString("SEPOLIA_RPC_URL", {
  description: "The URL of the Sepolia RPC endpoint.",
  default: "",
});

export const PEBBLE_NFT_ADDRESS = defineString("PEBBLE_NFT_ADDRESS", {
  description: "The address of the Pebble NFT contract.",
  default: "",
  input: {
    text: {
      validationRegex: /^0x[a-fA-F0-9]{40}$/,
      validationErrorMessage: "Must be a valid Ethereum address.",
    },
  },
});

export const OWNER_LOCAL_PRIVATE_KEY = defineString("OWNER_LOCAL_PRIVATE_KEY", {
  description: "The private key of the owner's Ethereum account.",
  default: "",
});

export const ownerSecretPrivateKey = defineSecret("OWNER_SECRET_PRIVATE_KEY");

export const BASE_IMAGE_URL = defineString("BASE_IMAGE_URL", {
  description: "The base URL for accessing images stored on Firebase storage.",
  default: "",
  input: {
    text: {
      validationRegex:
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      validationErrorMessage: "Must be a valid URL.",
    },
  },
});

export const APP_TITLE = "Pebble Api";
export const APP_VERSION = "0.0.0";

export const INITIAL_POINT = 0;
export const INITIAL_POTION = 1;
export const LOGIN_BONUS_POTION = 1;

export const RANDOM_PROBABILITIES = [
  50, 25, 12.5, 6.25, 3.125, 1.5625, 0.78125, 0.390625, 0.1953125,
];
export const MIN_RARITY = 1;
export const MAX_AGE_DAYS = 14;

export const RARITY_BASE_POINT = 100;

export const IS_DEV = NODE_ENV.value() === "development";

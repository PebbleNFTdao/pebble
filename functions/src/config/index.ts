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

export const JWT_TOKEN_SECRET = defineString("JWT_TOKEN_SECRET", {
  description: "The secret key used to sign and verify JWT tokens.",
  default: "dummy",
});

export const IS_DEV = NODE_ENV.value() === "development";

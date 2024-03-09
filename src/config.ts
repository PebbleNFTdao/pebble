// App
const NODE_ENV = import.meta.env.VITE_NODE_ENV || "development";
export const IS_DEV = NODE_ENV === "development";

// API
export const API_BASE_ENDPOINT = import.meta.env.VITE_API_BASE_ENDPOINT;
export const SEPOLIA_RPC_URL = import.meta.env.VITE_SEPOLIA_RPC_URL;

// Contract addresses
export const PEBBLE_NFT_CONTRACT_ADDRESS = import.meta.env
  .VITE_PEBBLE_NFT_CONTRACT_ADDRESS;
export const STAKE_STONE_ETH_CONTRACT_ADDRESS = import.meta.env
  .VITE_STAKE_STONE_ETH_CONTRACT_ADDRESS;

// Wallet Connect
export const WALLET_CONNECT_PROJECT_ID = import.meta.env
  .VITE_WALLET_CONNECT_PROJECT_ID;

// Firebase
export const FIREBASE_CONFIG = import.meta.env.VITE_FIREBASE_CONFIG || "{}";

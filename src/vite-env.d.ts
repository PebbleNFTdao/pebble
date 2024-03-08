/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NODE_ENV: string;
  readonly VITE_API_BASE_ENDPOINT: string;
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string;
  readonly VITE_PEBBLE_NFT_CONTRACT_ADDRESS: `0x${string}`;
  readonly VITE_STAKE_STONE_ETH_CONTRACT_ADDRESS: `0x${string}`;
  readonly VITE_FIREBASE_CONFIG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

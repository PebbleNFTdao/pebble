import {
  APP_TITLE,
  IS_DEV,
  SEPOLIA_RPC_URL,
  WALLET_CONNECT_PROJECT_ID,
} from "@/config";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { manta, sepolia } from "viem/chains";

export const wagmiConfig = getDefaultConfig({
  appName: APP_TITLE,
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains: IS_DEV
    ? [
        {
          ...sepolia,
          rpcUrls: {
            default: {
              http: [SEPOLIA_RPC_URL],
            },
          },
        },
      ]
    : [
        {
          ...manta,
          rpcUrls: {
            default: {
              http: ["https://pacific-rpc.manta.network/http"],
            },
          },
        },
      ],
});

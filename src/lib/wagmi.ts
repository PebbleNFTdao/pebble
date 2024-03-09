import { IS_DEV, SEPOLIA_RPC_URL, WALLET_CONNECT_PROJECT_ID } from "@/config";
import { APP_TITLE, MANTA_RPC_URL } from "@/constants";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { manta, sepolia } from "viem/chains";

const chains = IS_DEV
  ? {
      ...sepolia,
      rpcUrls: {
        default: {
          http: [SEPOLIA_RPC_URL],
        },
      },
    }
  : {
      ...manta,
      rpcUrls: {
        default: {
          http: [MANTA_RPC_URL],
        },
      },
    };

export const wagmiConfig = getDefaultConfig({
  appName: APP_TITLE,
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains: [chains],
});

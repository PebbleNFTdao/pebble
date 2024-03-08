import { createPublicClient, http } from "viem";
import { manta, sepolia } from "viem/chains";
import { IS_DEV, SEPOLIA_RPC_URL } from "../config";

const { chain, transport } = {
  chain: IS_DEV ? sepolia : manta,
  transport: http(
    IS_DEV ? SEPOLIA_RPC_URL.value() : "https://pacific-rpc.manta.network/http"
  ),
};

export const publicClient = createPublicClient({
  chain,
  transport,
});

import { initializeTRPCClient, trpc } from "@/client/trpc";
import { wagmiConfig } from "@/lib/wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";

type Props = {
  children: ReactNode;
};

const Providers = ({ children }: Props) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(initializeTRPCClient);

  return (
    <WagmiProvider config={wagmiConfig}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </WagmiProvider>
  );
};

export default Providers;

import { trpc } from "@/client/trpc";
import {
  CollectionEmptyPrompt,
  CollectionGrid,
  CollectionHeader,
  WalletConnectPrompt,
} from "@/components/collection";
import Loading from "@/components/common/loading";
import { Separator } from "@/components/ui/separator";
import { PEBBLE_RATE } from "@/config";
import { meta } from "@/config/meta";
import { extractAndSetAttributes, sortColleciton } from "@/lib/helpers";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useAccount } from "wagmi";

export function Component() {
  const { address, isConnected } = useAccount();
  const { data, isPending } = trpc.collection.listCollection.useQuery(
    { address: address! },
    {
      enabled: isConnected,
    }
  );
  const collection = extractAndSetAttributes(data ?? []).sort(sortColleciton);
  const totalStakeStoneEth = useMemo(
    () => (PEBBLE_RATE * collection.length).toFixed(2),
    [collection.length]
  );

  if (isPending && isConnected) return <Loading />;
  if (!address) return <WalletConnectPrompt />;
  if (collection.length === 0) return <CollectionEmptyPrompt />;

  return (
    <>
      <Helmet>
        <title>{meta.collection.title}</title>
        <meta name="description" content={meta.collection.description} />
      </Helmet>
      <div className="md:block">
        <div className="border-y">
          <div className="bg-background">
            <div className="grid lg:grid-cols-4">
              <div className="col-span-3 lg:col-span-4 border-x">
                <div className="h-full px-4 py-6 lg:px-8 max-w-[888px]">
                  <div className="border-none p-0 outline-none">
                    <CollectionHeader totalStakeStoneEth={totalStakeStoneEth} />
                    <Separator className="my-4" />
                    <CollectionGrid collection={collection} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

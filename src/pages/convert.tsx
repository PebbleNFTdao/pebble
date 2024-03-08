import InfoImageSection from "@/components/convert/info-image-section";
import TokenConvert from "@/components/convert/token-convert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabAction } from "@/enums";
import { useUserRequest } from "@/hooks/user";
import { useState } from "react";

const tabDetails = {
  [TabAction.Crush]: {
    title: "Crush StakeStone ETH",
    description: `Pebble NFT makes your StakeStone ETH more enjoyable. By "crushing" your StakedStone ETH, you can convert every 0.05 of it for one Pebble NFT. Each NFT has its own rarity, and the higher the rarity, the more daily point airdrops you'll receive. It's a fun twist to boost your crypto journey.`,
    imageName: "/crush.webp",
    operationTitle: "Crush StakeStone ETH",
    operationDescription:
      "Enter the quantity of StakeStone ETH you want to crush.",
    label: "Pebble Quantity",
    resultPrefix: "You will deposit",
    altText: "Crush StakeStone ETH",
  },
  [TabAction.Restore]: {
    title: "Restore Pebble NFTs",
    description: `Pebble NFT lets you "restore" 1 Pebble NFT back into 0.05 StakedStone ETH. You can wait 2 weeks after "crushing" or use a potion for an instant restore. But be careful when restoring high rarity NFTs – it's a one-way street with no undo button!`,
    imageName: "/restore.webp",
    operationTitle: "Restore Pebble NFTs",
    operationDescription: "Enter the quantity of Pebbles you want to restore.",
    label: "Pebble Quantity",
    resultPrefix: "You will withdraw",
    altText: "Restore Pebble NFTs",
  },
};

export default function ConvertPage() {
  const [tab, setTab] = useState(TabAction.Crush);
  const { user } = useUserRequest();

  return (
    <>
      {tab === TabAction.Crush && (
        <InfoImageSection
          title={tabDetails[TabAction.Crush].title}
          description={tabDetails[TabAction.Crush].description}
          imageName={tabDetails[TabAction.Crush].imageName}
          altText={tabDetails[TabAction.Crush].altText}
        />
      )}
      {tab === TabAction.Restore && (
        <InfoImageSection
          title={tabDetails[TabAction.Restore].title}
          description={tabDetails[TabAction.Restore].description}
          imageName={tabDetails[TabAction.Restore].imageName}
          altText={tabDetails[TabAction.Restore].altText}
        />
      )}
      <Tabs
        defaultValue={TabAction.Crush}
        onValueChange={(value) => setTab(value as TabAction)}
        className="md:w-[600px]"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value={TabAction.Crush}>{TabAction.Crush}</TabsTrigger>
          <TabsTrigger value={TabAction.Restore}>
            {TabAction.Restore}
          </TabsTrigger>
        </TabsList>
        <TabsContent value={TabAction.Crush}>
          <TokenConvert
            title={tabDetails[TabAction.Crush].operationTitle}
            description={tabDetails[TabAction.Crush].operationDescription}
            label={tabDetails[TabAction.Crush].label}
            resultPrefix={tabDetails[TabAction.Crush].resultPrefix}
            action={TabAction.Crush}
            user={user}
          />
        </TabsContent>
        <TabsContent value={TabAction.Restore}>
          <TokenConvert
            title={tabDetails[TabAction.Restore].operationTitle}
            description={tabDetails[TabAction.Restore].operationDescription}
            label={tabDetails[TabAction.Restore].label}
            resultPrefix={tabDetails[TabAction.Restore].resultPrefix}
            action={TabAction.Restore}
            user={user}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}

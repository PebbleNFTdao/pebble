import InfoImageSection from "@/components/convert/info-image-section";
import TokenConvert from "@/components/convert/token-convert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabActionType } from "@/enums";
import { useUserRequest } from "@/hooks/user";
import { useState } from "react";

const { Crush, Restore } = TabActionType;

const tabDetails = {
  [Crush]: {
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
  [Restore]: {
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
  const [tab, setTab] = useState(Crush);
  const { user } = useUserRequest();

  return (
    <>
      {tab === Crush && (
        <InfoImageSection
          title={tabDetails[Crush].title}
          description={tabDetails[Crush].description}
          imageName={tabDetails[Crush].imageName}
          altText={tabDetails[Crush].altText}
        />
      )}
      {tab === Restore && (
        <InfoImageSection
          title={tabDetails[Restore].title}
          description={tabDetails[Restore].description}
          imageName={tabDetails[Restore].imageName}
          altText={tabDetails[Restore].altText}
        />
      )}
      <Tabs
        defaultValue={Crush}
        onValueChange={(value) => setTab(value as TabActionType)}
        className="md:w-[600px]"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value={Crush}>{Crush}</TabsTrigger>
          <TabsTrigger value={Restore}>{Restore}</TabsTrigger>
        </TabsList>
        <TabsContent value={Crush}>
          <TokenConvert
            title={tabDetails[Crush].operationTitle}
            description={tabDetails[Crush].operationDescription}
            label={tabDetails[Crush].label}
            resultPrefix={tabDetails[Crush].resultPrefix}
            action={Crush}
            user={user}
          />
        </TabsContent>
        <TabsContent value={Restore}>
          <TokenConvert
            title={tabDetails[Restore].operationTitle}
            description={tabDetails[Restore].operationDescription}
            label={tabDetails[Restore].label}
            resultPrefix={tabDetails[Restore].resultPrefix}
            action={Restore}
            user={user}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { User } from "@/types";

interface Props {
  user: User | undefined;
}

export default function AccordionSection({ user }: Props) {
  const { points = "", potions = "", referralCount = "" } = user || {};

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="!no-underline">
          <div className="text-lg">
            🤑 Total Points <span className="pl-6 pr-2">-</span>
            {points.toString()}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          Pebble NFT holders receive an airdrop of points daily, calculated as
          their rarity multiplied by 100.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="!no-underline">
          <div className="text-lg">
            🍾 Total Potions <span className="pl-4 pr-2">-</span>
            {potions.toString()}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          Using a potion allows you to restore your STONE without having to wait
          for the 14-day period.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="!no-underline">
          <div className="text-lg">
            📨 Total Referrals <span className="pl-1 pr-2">-</span>
            {referralCount.toString()}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          By inviting new users through referrals, you can receive a potion
          which can be used for instant restore, and you will also receive bonus
          points later.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

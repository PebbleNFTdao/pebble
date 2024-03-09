import ReferralLink from "@/components/airdrop/referral-link";
import { META, PBLO_SYMBOL } from "@/constants";
import { useUserRequest } from "@/hooks/user";
import { Helmet } from "react-helmet-async";
import AccordionSection from "../components/airdrop/accordion-section";

export function Component() {
  const { user } = useUserRequest();
  const referralCode = user?.referralCode ?? null;

  return (
    <>
      <Helmet>
        <title>{META.airdrop.title}</title>
        <meta name="description" content={META.airdrop.description} />
      </Helmet>
      <div className="max-w-[450px] md:max-w-[600px]">
        <div className="flex py-2 md:py-6 flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0">
          <img
            width={180}
            height={180}
            src={`/airdrop.webp`}
            alt="Airdrop"
            className="w-[180px] h-[180px]"
          />
          <div className="pl-6">
            <h1 className="text-lg md:text-2xl pb-2 text-center md:text-left">
              ${PBLO_SYMBOL} Airdrop
            </h1>
            <p className="text-sm md:text-base">
              Pebble NFT awards points daily based on rarity, representing
              contribution to the Pebble NFT ecosystem and influencing future $
              {PBLO_SYMBOL} token distribution, a key governance token for the
              Pebble NFT DAO. High rarity NFT holders can expect additional
              rewards.
            </p>
          </div>
        </div>

        <AccordionSection user={user} />

        {referralCode && <ReferralLink code={String(referralCode)} />}
      </div>
    </>
  );
}

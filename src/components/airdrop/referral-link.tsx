import { Button } from "@/components/ui/button";
import { useState } from "react";

type Props = {
  code: string;
};

export default function ReferralLink({ code }: Props) {
  const [btnText, setBtnText] = useState("Copy to Clipboard");
  const referralLink = `${window.location.origin}?code=${code}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink!);
      setBtnText("Copied!");
    } catch (err) {
      setBtnText("Failed to copy!");
    } finally {
      setTimeout(() => {
        setBtnText("Copy to Clipboard");
      }, 5000);
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="rounded-3xl py-6 md:px-8 p-5 bg-custom-bg w-full flex gap-5 flex-wrap max-w-3xl">
        <div className="flex flex-grow flex-col text-center">
          <h6 className="mb-3 text-lg">Your Referral Link</h6>
          <span className="text-base mb-6">{referralLink}</span>
          <Button onClick={copyToClipboard}>{btnText}</Button>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLoginBonus } from "@/hooks/reward";
import { useUserRequest } from "@/hooks/user";
import { isBeforeToday } from "@/lib/utils";
import { useState } from "react";
import { AiOutlineCalendar } from "react-icons/ai";

export default function DailyLoginBonus() {
  const { user, loading: initialLoading } = useUserRequest();
  const { address, claimDailyLoginBonus, loading } = useLoginBonus();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const isEligible =
    !initialLoading &&
    (user?.lastDailyBonusAt ? isBeforeToday(user?.lastDailyBonusAt) : true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative inline-block mr-6">
          <AiOutlineCalendar
            className="w-6 h-6 cursor-pointer hover:text-gray-600"
            onClick={() => setOpen(true)}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[350px] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Daily Login Bonus</DialogTitle>
          <DialogDescription>
            As today's login bonus, you're eligible to receive a potion.
            Remember to log in daily for more rewards. Our Daily Login Bonus
            resets at UTC+0 each day.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-center">
          {address && <p>Your potion for today is ready to be claimed.</p>}
          {!address && <p>Please, connect your wallet first.</p>}
        </div>
        <DialogFooter className="flex justify-end gap-2">
          {address && (
            <>
              <DialogClose asChild>
                <Button variant="secondary" disabled={loading}>
                  Close
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={() => claimDailyLoginBonus(close)}
                disabled={loading || !isEligible}
              >
                {!isEligible ? "Already claimed" : loading ? "Claiming..." : ""}
                Claim Potion
              </Button>
            </>
          )}
          {!address && (
            <DialogClose asChild>
              <Button variant="secondary" disabled={loading}>
                Close
              </Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

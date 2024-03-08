import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePath } from "@/hooks/path";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { NavLink } from "react-router-dom";

export default function MobileNav() {
  const { toPath } = usePath();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="ml-4 lg:hidden" variant="outline">
          <HamburgerMenuIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-base">Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <NavLink to={`/${toPath}`}>
            <DropdownMenuItem className="cursor-pointer h-12 text-base">
              Convert
            </DropdownMenuItem>
          </NavLink>
          <NavLink to={`/collection${toPath}`}>
            <DropdownMenuItem className="cursor-pointer h-12 text-base">
              Collection
            </DropdownMenuItem>
          </NavLink>
          <NavLink to={`/airdrop${toPath}`}>
            <DropdownMenuItem className="cursor-poinater h-12 text-base">
              Airdrop
            </DropdownMenuItem>
          </NavLink>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { APP_TITLE } from "@/constants";
import { usePath } from "@/hooks/path";
import { cn } from "@/lib/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NavLink } from "react-router-dom";
import MobileNav from "./mobile-nav";

export default function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { toPath } = usePath();

  return (
    <nav className={cn("flex items-center w-full", className)} {...props}>
      <img alt="Logo" width={30} height={30} className="mr-2" src="/logo.svg" />
      <div className="flex">
        <NavLink to={`/${toPath}`}>
          <h1 className="text-xl font-bold mr-8">{APP_TITLE}</h1>
        </NavLink>
        <div className="hidden lg:block lg:space-x-6">
          <NavLink
            to={`/${toPath}`}
            className={({ isActive }) =>
              `${
                isActive ? "text-primary" : "text-muted-foreground"
              } text-sm font-medium transition-colors hover:text-primary`
            }
          >
            Convert
          </NavLink>
          <NavLink
            to={`/collection${toPath}`}
            className={({ isActive }) =>
              `${
                isActive ? "text-primary" : "text-muted-foreground"
              } text-sm font-medium transition-colors hover:text-primary`
            }
          >
            Collection
          </NavLink>
          <NavLink
            to={`/airdrop${toPath}`}
            className={({ isActive }) =>
              `${
                isActive ? "text-primary" : "text-muted-foreground"
              } text-sm font-medium transition-colors hover:text-primary`
            }
          >
            Airdrop
          </NavLink>
        </div>
      </div>
      <div className="ml-auto flex items-center">
        <ConnectButton
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
          chainStatus={{
            smallScreen: "icon",
            largeScreen: "full",
          }}
          showBalance={{
            smallScreen: false,
            largeScreen: true,
          }}
        />
      </div>
      <MobileNav />
    </nav>
  );
}

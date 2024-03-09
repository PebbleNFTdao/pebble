import { SOCIAL_URLS } from "@/constants";
import { cn } from "@/lib/utils";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import React from "react";

export default function Footer({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer
      className={cn("w-full mt-8 p-4 py-6 border-t", className)}
      {...props}
    >
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-start md:items-center">
        <div />
        <div className="flex flex-col lg:flex-row lg:space-x-6 lg:mt-0">
          <a
            href={SOCIAL_URLS.github}
            className="text-gray-400 text-sm hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubLogoIcon className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}

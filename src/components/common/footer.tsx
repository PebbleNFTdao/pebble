import { SOCIAL_URLS } from "@/constants";
import { cn } from "@/lib/utils";
import { CubeIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import React from "react";
import { FaXTwitter } from "react-icons/fa6";
import { LuBook } from "react-icons/lu";

export default function Footer({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer
      className={cn("w-full mt-8 p-4 py-6 border-t", className)}
      {...props}
    >
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-end md:items-center">
        <div />
        <div className="flex flex-row space-x-6 lg:mt-0">
          <a
            href={SOCIAL_URLS.x}
            className="text-gray-400 text-sm hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaXTwitter className="w-6 h-6" />
          </a>
          <a
            href={SOCIAL_URLS.github}
            className="text-gray-400 text-sm hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubLogoIcon className="w-6 h-6" />
          </a>
          <a
            href={SOCIAL_URLS.gitbook}
            className="text-gray-400 text-sm hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LuBook className="w-6 h-6" />
          </a>
          <a
            href={SOCIAL_URLS.element}
            className="text-gray-400 text-sm hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <CubeIcon className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}

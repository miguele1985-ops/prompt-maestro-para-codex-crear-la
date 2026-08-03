"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackDownload } from "@/components/StatsTracker";

type TrackedDownloadLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
};

export function TrackedDownloadLink({ children, href, onClick, ...props }: TrackedDownloadLinkProps) {
  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        trackDownload(typeof href === "string" ? href : undefined);
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}

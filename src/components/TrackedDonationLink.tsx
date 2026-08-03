"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { trackDonation } from "@/components/StatsTracker";

type TrackedDonationLinkProps = ComponentProps<typeof Link> & {
  children: ReactNode;
};

export function TrackedDonationLink({ children, href, onClick, ...props }: TrackedDonationLinkProps) {
  return (
    <Link
      {...props}
      href={href}
      onClick={(event) => {
        trackDonation(typeof href === "string" ? href : undefined);
        onClick?.(event);
      }}
    >
      {children}
    </Link>
  );
}

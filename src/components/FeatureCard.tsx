import Link from "next/link";
import { createElement } from "react";
import { getIcon } from "@/lib/icons";
import type { AppFeature } from "@/types/content";
import { AvailabilityBadge } from "./Badges";

export function FeatureCard({ feature }: { feature: AppFeature }) {
  return (
    <article className="feature-card">
      <div className="feature-card-top">
        <span className="icon-shell">{createElement(getIcon(feature.icon), { size: 24, "aria-hidden": true })}</span>
        <AvailabilityBadge value={feature.availability} />
      </div>
      <h3>{feature.title}</h3>
      <p>{feature.shortDescription}</p>
      <ul>
        {feature.highlights.slice(0, 4).map((item) => <li key={item}>{item}</li>)}
      </ul>
      <Link href={`/${feature.slug}`}>Ampliar función</Link>
    </article>
  );
}

export function FeatureGrid({ features }: { features: AppFeature[] }) {
  return <div className="feature-grid">{features.map((feature) => <FeatureCard key={feature.id} feature={feature} />)}</div>;
}

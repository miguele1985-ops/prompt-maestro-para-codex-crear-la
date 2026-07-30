import type { FeatureAvailability } from "@/types/content";

const labels: Record<FeatureAvailability, string> = {
  offline: "Offline",
  online: "Online",
  hybrid: "Híbrida",
};

export function AvailabilityBadge({ value }: { value: FeatureAvailability }) {
  return <span className={`badge badge-${value}`}>{labels[value]}</span>;
}

export function SafetyWarning({ title = "Aviso importante", children }: { title?: string; children: React.ReactNode }) {
  return (
    <aside className="safety-warning" role="note" aria-label={title}>
      <strong>{title}</strong>
      <p>{children}</p>
    </aside>
  );
}

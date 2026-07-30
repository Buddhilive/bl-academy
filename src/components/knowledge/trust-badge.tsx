import { Badge } from "@/components/ui/badge";
import type { TrustTier } from "@/lib/knowledge/types";

const TIER_CONFIG: Record<TrustTier, { label: string; variant: "outline" | "secondary" | "default" }> = {
  unverified: { label: "Unverified", variant: "outline" },
  "machine-confirmed": { label: "Machine-confirmed", variant: "secondary" },
  "human-reviewed": { label: "Human-reviewed", variant: "default" },
};

export function TrustBadge({ tier }: { tier: TrustTier }) {
  const { label, variant } = TIER_CONFIG[tier];
  return <Badge variant={variant}>{label}</Badge>;
}

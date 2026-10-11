// Full class names are written out (not built from pieces) so Tailwind can find them.
export const RISK_LEVELS = ["low", "medium", "high", "critical"];

const BADGE = {
  low: "bg-risk-low-bg text-risk-low",
  medium: "bg-risk-medium-bg text-risk-medium",
  high: "bg-risk-high-bg text-risk-high",
  critical: "bg-risk-critical-bg text-risk-critical",
};

export const RISK_TEXT = {
  low: "text-risk-low",
  medium: "text-risk-medium",
  high: "text-risk-high",
  critical: "text-risk-critical",
};

export const RISK_BORDER = {
  low: "border-l-risk-low",
  medium: "border-l-risk-medium",
  high: "border-l-risk-high",
  critical: "border-l-risk-critical",
};

export const RISK_FILL = {
  low: "bg-risk-low",
  medium: "bg-risk-medium",
  high: "bg-risk-high",
  critical: "bg-risk-critical",
};

// Props: level is "low" | "medium" | "high" | "critical" (the backend's RiskLevel enum).
export default function RiskBadge({ level }) {
  const style = BADGE[level] || "bg-sage-light text-ink";
  return (
    <span
      className={`inline-block rounded-sm px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${style}`}
    >
      {level}
    </span>
  );
}

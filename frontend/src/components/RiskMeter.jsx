import { RISK_FILL, RISK_LEVELS, RISK_TEXT } from "./RiskBadge";
import { smallLabel } from "../styles";

// A four-step scale. Every step up to the current level is filled in.
// Props: level ("low" | "medium" | "high" | "critical").
export default function RiskMeter({ level }) {
  const position = RISK_LEVELS.indexOf(level);

  return (
    <div>
      <p className={smallLabel}>Overall risk</p>
      <p className={`mt-3 font-serif text-6xl font-medium capitalize leading-none ${RISK_TEXT[level] || ""}`}>
        {level}
      </p>

      <div className="mt-6 grid grid-cols-4 gap-1.5" role="img" aria-label={`Overall risk is ${level}`}>
        {RISK_LEVELS.map((name, index) => (
          <div key={name}>
            <div className={`h-2.5 rounded-sm ${index <= position ? RISK_FILL[level] : "bg-ivory-dark"}`} />
            <p className={`mt-2 text-[11px] capitalize ${index === position ? "font-semibold text-ink" : "text-muted"}`}>
              {name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

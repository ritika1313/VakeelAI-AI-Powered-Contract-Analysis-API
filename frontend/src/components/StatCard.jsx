import Icon from "./Icons";
import { card, smallLabel } from "../styles";

// Props: label, value (a number), hint (small text), icon (name), valueClass (optional colour).
export default function StatCard({ label, value, hint, icon, valueClass = "text-ink" }) {
  return (
    <div className={`${card} p-5`}>
      <div className="flex items-start justify-between gap-3">
        <p className={smallLabel}>{label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-sage-light text-forest">
          <Icon name={icon} className="h-4 w-4" />
        </span>
      </div>
      <p className={`mt-4 font-serif text-5xl font-medium leading-none ${valueClass}`}>{value}</p>
      <p className="mt-3 text-sm text-muted">{hint}</p>
    </div>
  );
}

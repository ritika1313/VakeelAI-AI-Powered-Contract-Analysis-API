import Icon from "./Icons";
import { primaryButton, secondaryButton } from "../styles";

// Props:
//   page, onNavigate      current page and navigation callback
//   contractCount         number of uploaded contracts
//   onRefresh, refreshing reload the data from the API
//   onUpload             go to the upload area on the dashboard
const ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "contracts", label: "All contracts" },
  { id: "analysis", label: "Analysis" },
];

export default function Topbar({
  page,
  onNavigate,
  contractCount,
  onRefresh,
  refreshing,
  onUpload,
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-forest-deep text-ivory">
      <div className="flex min-h-16 w-full flex-wrap items-center justify-between gap-x-2 gap-y-1 px-4 py-2 sm:px-6 lg:flex-nowrap lg:px-8">
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-sage">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3v16m-7 2h14M5 7h14M12 3l-2 2m2-2 2 2" />
              <path d="m5 7-3 6h6L5 7Zm14 0-3 6h6l-3-6Z" />
              <path d="M2 13c.4 2 1.4 3 3 3s2.6-1 3-3m8 0c.4 2 1.4 3 3 3s2.6-1 3-3" />
            </svg>
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="font-serif text-2xl font-semibold leading-none tracking-tight sm:text-[1.65rem]">Vakeel</span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">AI</span>
          </span>
        </div>

        <nav aria-label="Main" className="order-3 flex w-full min-w-0 flex-wrap items-center justify-center gap-6 lg:order-none lg:w-auto">
          {ITEMS.map((item) => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-w-0 items-center gap-1.5 rounded-md border-b-2 px-2 py-2 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                  active
                    ? "border-sage bg-white/10 text-ivory"
                    : "border-transparent text-sage-light/80 hover:bg-white/5 hover:text-ivory"
                }`}
              >
                <span>{item.label}</span>
                {item.id === "contracts" && contractCount > 0 && (
                  <span className="rounded-sm bg-white/10 px-1.5 py-0.5 text-xs">{contractCount}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center justify-end gap-2">
          <button type="button" onClick={onRefresh} disabled={refreshing} aria-label="Refresh data" className={`${secondaryButton} px-2.5 py-2 sm:px-4 sm:py-2.5`}>
            <Icon name="refresh" className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button type="button" onClick={onUpload} aria-label="Upload contract" className={`${primaryButton} px-2.5 py-2 sm:px-4 sm:py-2.5`}>
            <Icon name="upload" className="h-4 w-4" />
            <span>
              Upload<span className="hidden sm:inline"> contract</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

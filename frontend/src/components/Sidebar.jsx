import Icon from "./Icons";

const ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "grid" },
  { id: "contracts", label: "All contracts", icon: "file" },
  { id: "analysis", label: "Analysis", icon: "shield" },
];

const STATUS_TEXT = {
  checking: "Checking connection…",
  online: "Backend connected",
  wrong: "Not the Vakeel API",
  offline: "Backend unreachable",
};

const STATUS_DOT = {
  checking: "bg-sage animate-pulse",
  online: "bg-sage",
  wrong: "bg-risk-high-bg",
  offline: "bg-risk-high-bg",
};

// Props:
//   page, onNavigate  which page is showing, and a function to change it
//   contractCount     the badge number next to "All contracts"
//   apiStatus, apiUrl the result of the backend connection check
//   open, onClose     control the slide-in menu on small screens
export default function Sidebar({ page, onNavigate, contractCount, apiStatus, apiUrl, open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-ink/40 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-forest-deep text-ivory transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-sage">
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
            <span className="flex min-w-0 items-baseline gap-1.5">
              <span className="font-serif text-[1.65rem] font-semibold leading-none tracking-tight">Vakeel</span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">AI</span>
            </span>
          </div>
          <button type="button" onClick={onClose} aria-label="Close navigation" className="lg:hidden">
            <Icon name="x" />
          </button>
        </div>

        <nav aria-label="Main" className="flex-1 space-y-1 px-3 py-6">
          {ITEMS.map((item) => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={active ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  active
                    ? "border-sage bg-white/10 text-ivory"
                    : "border-transparent text-sage-light/80 hover:bg-white/5 hover:text-ivory"
                }`}
              >
                <Icon name={item.icon} className="h-5 w-5" />
                <span className="flex-1">{item.label}</span>
                {item.id === "contracts" && contractCount > 0 && (
                  <span className="rounded-sm bg-white/10 px-2 py-0.5 text-xs">{contractCount}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-6 py-5">
          <p className="font-serif text-sm italic leading-snug text-sage-light/80">
            Understand your contracts. Make informed decisions.
          </p>
          <div className="mt-5 flex items-center gap-2 text-xs text-sage-light/80" title={apiStatus.message}>
            <span className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[apiStatus.state]}`} />
            <span>{STATUS_TEXT[apiStatus.state]}</span>
          </div>
          <p className="mt-1 truncate text-xs text-sage-light/50">{apiUrl}</p>
        </div>
      </aside>
    </>
  );
}

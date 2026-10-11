import { useState } from "react";
import { card, inputStyle, primaryButton, secondaryButton, smallLabel } from "../styles";
import ContractActions from "../components/ContractActions";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icons";
import Notice from "../components/Notice";
import PageHeader from "../components/PageHeader";
import RiskBadge, { RISK_LEVELS } from "../components/RiskBadge";
import StatusPill from "../components/StatusPill";
import { formatDate, formatDateTime } from "../utils";

const COLUMNS = "xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_8.5rem_6.5rem_13rem]";

// Props:
//   rows              [{ contract, analysis, analysisCount }] built by buildStats()
//   status, error     "loading" | "ready" | "error", and the error message
//   onRetry, onOpen, onAnalyse, analysingId, rowError, onGoUpload   functions and values from App
export default function ContractsPage({ rows, status, error, onRetry, onOpen, onAnalyse, analysingId, rowError, onGoUpload }) {
  // State owned by this page only: the filters, and which row is expanded.
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const filtersActive = query !== "" || statusFilter !== "all" || riskFilter !== "all";

  const filtered = rows.filter(({ contract, analysis }) => {
    if (query.trim() && !contract.original_name.toLowerCase().includes(query.trim().toLowerCase())) return false;
    if (statusFilter === "analysed" && !analysis) return false;
    if (statusFilter === "pending" && analysis) return false;
    if (riskFilter !== "all" && (!analysis || analysis.overall_risk_level !== riskFilter)) return false;
    return true;
  });

  function clearFilters() {
    setQuery("");
    setStatusFilter("all");
    setRiskFilter("all");
  }

  return (
    <div>
      <PageHeader
        title="All contracts"
        text="Every contract you have uploaded, with its analysis status and risk level."
      />

      {status === "loading" && (
        <div role="status" aria-label="Loading contracts" className="mt-6 space-y-3">
          {[0, 1, 2, 3].map((n) => (
            <div key={n} className="h-16 animate-pulse rounded-md bg-ivory-dark" />
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="mt-6 space-y-4">
          <Notice type="error">
            <p className="font-medium">Your contracts could not be loaded.</p>
            <p className="mt-1">{error}</p>
          </Notice>
          <button type="button" onClick={onRetry} className={secondaryButton}>
            Try again
          </button>
        </div>
      )}

      {status === "ready" && rows.length === 0 && (
        <div className="mt-6">
          <EmptyState
            icon="upload"
            title="No contracts yet"
            text="Upload a PDF or TXT contract and it will be listed here with its analysis."
            action={
              <button type="button" onClick={onGoUpload} className={primaryButton}>
                Upload a contract
              </button>
            }
          />
        </div>
      )}

      {status === "ready" && rows.length > 0 && (
        <section className={`${card} mt-6`}>
          <div className="flex flex-wrap items-center gap-3 border-b border-line p-3 sm:p-4">
            <label className="relative min-w-52 flex-1">
              <span className="sr-only">Search contracts by name</span>
              <Icon name="search" className="absolute left-3 top-3 h-4 w-4 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by file name"
                className={`${inputStyle} w-full pl-9`}
              />
            </label>
            <label>
              <span className="sr-only">Filter by status</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={inputStyle}>
                <option value="all">All statuses</option>
                <option value="analysed">Analysed</option>
                <option value="pending">Not analysed</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Filter by risk level</span>
              <select value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)} className={inputStyle}>
                <option value="all">All risk levels</option>
                {RISK_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)} risk
                  </option>
                ))}
              </select>
            </label>
            {filtersActive && (
              <button type="button" onClick={clearFilters} className={secondaryButton}>
                Clear filters
              </button>
            )}
            <p className="ml-auto text-sm text-muted">
              Showing {filtered.length} of {rows.length}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon="search"
                title="No contracts match"
                text="Try a different search or clear the filters."
                action={
                  <button type="button" onClick={clearFilters} className={secondaryButton}>
                    Clear filters
                  </button>
                }
              />
            </div>
          ) : (
            <>
              <div className={`hidden gap-4 border-b border-line bg-ivory-dark/60 px-4 py-3 xl:grid xl:gap-5 sm:px-6 ${COLUMNS} ${smallLabel}`}>
                <span>Document</span>
                <span>Type</span>
                <span>Status</span>
                <span>Risk</span>
                <span className="w-52 text-right">Actions</span>
              </div>

              <ul>
                {filtered.map(({ contract, analysis, analysisCount }) => {
                  const expanded = expandedId === contract.id;
                  const isPdf = contract.original_name.toLowerCase().endsWith(".pdf");

                  return (
                    <li key={contract.id} className="border-b border-line last:border-b-0">
                      <div className={`grid gap-3 px-4 py-4 xl:items-center xl:gap-5 sm:px-6 ${COLUMNS}`}>
                        <div className="min-w-0">
                          <p className="break-words font-medium xl:truncate">{contract.original_name}</p>
                          <p className="text-sm text-muted">
                            {formatDate(contract.upload_date)} · {contract.word_count.toLocaleString("en-IN")} words
                          </p>
                        </div>
                        <p className="break-words text-sm">{analysis ? analysis.contract_type : "-"}</p>
                        <StatusPill analysed={Boolean(analysis)} busy={analysingId === contract.id} />
                        <div>{analysis ? <RiskBadge level={analysis.overall_risk_level} /> : <span className="text-sm text-muted">-</span>}</div>
                        <div className="flex flex-wrap items-center gap-2 xl:w-52 xl:justify-end">
                          <button
                            type="button"
                            onClick={() => setExpandedId(expanded ? null : contract.id)}
                            aria-expanded={expanded}
                            aria-label={`${expanded ? "Hide" : "Show"} details for ${contract.original_name}`}
                            className="inline-flex items-center gap-1 rounded-md px-2 text-sm text-muted hover:bg-sage-light"
                          >
                            Details
                            <Icon name="chevron" className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
                          </button>
                          <ContractActions
                            contract={contract}
                            analysis={analysis}
                            analysingId={analysingId}
                            onOpen={onOpen}
                            onAnalyse={onAnalyse}
                          />
                        </div>
                      </div>

                      {rowError && rowError.id === contract.id && (
                        <div className="px-6 pb-4">
                          <Notice type="error">{rowError.message}</Notice>
                        </div>
                      )}

                      {expanded && (
                        <dl className="grid gap-x-8 gap-y-4 border-t border-line bg-ivory-dark/60 px-6 py-5 text-sm sm:grid-cols-2 lg:grid-cols-3">
                          <Detail label="Uploaded" value={formatDateTime(contract.upload_date)} />
                          <Detail label="Words" value={contract.word_count.toLocaleString("en-IN")} />
                          {/* For TXT files the backend stores the line count in page_count. */}
                          <Detail label={isPdf ? "Pages" : "Lines"} value={contract.page_count.toLocaleString("en-IN")} />
                          <Detail label="Analyses run" value={analysisCount} />
                          <Detail label="Last analysed" value={analysis ? formatDateTime(analysis.analysis_date) : "Never"} />
                          <Detail label="Contract ID" value={contract.id} mono />
                        </dl>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </section>
      )}
    </div>
  );
}

// A label and a value, used in the details panel. Props: label, value, mono (use a monospace font).
function Detail({ label, value, mono = false }) {
  return (
    <div className="min-w-0">
      <dt className={smallLabel}>{label}</dt>
      <dd className={`mt-1 break-all ${mono ? "font-mono text-xs" : ""}`}>{value}</dd>
    </div>
  );
}

import { card, secondaryButton } from "../styles";
import ContractActions from "../components/ContractActions";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icons";
import Notice from "../components/Notice";
import PageHeader from "../components/PageHeader";
import RiskBadge from "../components/RiskBadge";
import RiskSummary from "../components/RiskSummary";
import StatCard from "../components/StatCard";
import StatusPill from "../components/StatusPill";
import UploadPanel from "../components/UploadPanel";
import { formatDate } from "../utils";

// Props:
//   data              the numbers and rows built by buildStats() in utils.js
//   status, error     "loading" | "ready" | "error", and the error message
//   onRetry           reload the data
//   onOpen, onAnalyse, analysingId, rowError   passed on to each contract row
//   onViewAll         go to the All contracts page
//   onUploaded, onAnalysed                     passed on to the upload panel
export default function DashboardPage({
  data,
  status,
  error,
  onRetry,
  onOpen,
  onAnalyse,
  analysingId,
  rowError,
  onViewAll,
  onUploaded,
  onAnalysed,
}) {
  const recent = data.rows.slice(0, 5);

  return (
    <div>
      <PageHeader title="Dashboard" text="Understand your contracts. Make informed decisions." />

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem]">
        {/* On small screens the upload panel comes first (order-1). On wide screens it moves to the right. */}
        <div className="order-1 xl:order-2 xl:sticky xl:top-24 xl:self-start">
          <UploadPanel onUploaded={onUploaded} onAnalysed={onAnalysed} />
        </div>

        <div className="order-2 min-w-0 space-y-6 xl:order-1">
          {status === "loading" && (
            <div role="status" aria-label="Loading dashboard" className="space-y-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[0, 1, 2, 3].map((n) => (
                  <div key={n} className="h-36 animate-pulse rounded-md bg-ivory-dark" />
                ))}
              </div>
              <div className="h-40 animate-pulse rounded-md bg-ivory-dark" />
              <div className="h-72 animate-pulse rounded-md bg-ivory-dark" />
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <Notice type="error">
                <p className="font-medium">Your contracts could not be loaded.</p>
                <p className="mt-1">{error}</p>
              </Notice>
              <button type="button" onClick={onRetry} className={secondaryButton}>
                Try again
              </button>
            </div>
          )}

          {status === "ready" && (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Contracts" value={data.total} hint="Uploaded in total" icon="file" />
                <StatCard label="Analysed" value={data.analysed} hint="With a completed analysis" icon="shield" />
                <StatCard label="Awaiting" value={data.pending} hint="Not analysed yet" icon="upload" />
                <StatCard
                  label="Needs attention"
                  value={data.attention}
                  hint="High or critical risk"
                  icon="alert"
                  valueClass={data.attention > 0 ? "text-risk-high" : "text-ink"}
                />
              </div>

              <RiskSummary riskCounts={data.riskCounts} analysed={data.analysed} flagCount={data.flagCount} />

              <section className={card} aria-labelledby="recent-heading">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-4 sm:px-6">
                  <h2 id="recent-heading" className="text-2xl font-medium">
                    Recent contracts
                  </h2>
                  {data.total > 0 && (
                    <button type="button" onClick={onViewAll} className={secondaryButton}>
                      View all
                      <Icon name="back" className="h-4 w-4 rotate-180" />
                    </button>
                  )}
                </div>

                {recent.length === 0 ? (
                  <div className="p-6">
                    <EmptyState
                      icon="upload"
                      title="No contracts yet"
                      text="Upload your first contract with the panel and it will appear here."
                    />
                  </div>
                ) : (
                  <ul>
                    {recent.map(({ contract, analysis }) => (
                      <li key={contract.id} className="border-b border-line px-4 py-4 last:border-b-0 sm:px-6">
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                          <div className="min-w-0 flex-1 basis-56">
                            <p className="truncate font-medium">{contract.original_name}</p>
                            <p className="text-sm text-muted">
                              {formatDate(contract.upload_date)}
                              {analysis && ` · ${analysis.contract_type}`}
                            </p>
                          </div>
                          <div className="w-28">
                            {analysis ? (
                              <RiskBadge level={analysis.overall_risk_level} />
                            ) : (
                              <StatusPill analysed={false} busy={analysingId === contract.id} />
                            )}
                          </div>
                          <ContractActions
                            contract={contract}
                            analysis={analysis}
                            analysingId={analysingId}
                            onOpen={onOpen}
                            onAnalyse={onAnalyse}
                          />
                        </div>
                        {rowError && rowError.id === contract.id && (
                          <div className="mt-3">
                            <Notice type="error">{rowError.message}</Notice>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

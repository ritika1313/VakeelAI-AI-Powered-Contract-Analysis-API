import { card, primaryButton, secondaryButton, smallLabel } from "../styles";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icons";
import PageHeader from "../components/PageHeader";
import RiskBadge, { RISK_BORDER, RISK_LEVELS } from "../components/RiskBadge";
import RiskMeter from "../components/RiskMeter";
import { formatDate, formatDateTime } from "../utils";

// Used to show the most serious risks first.
const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

// Props:
//   contract, analysis  the selected contract and its newest analysis (both null if nothing is selected)
//   rows                all contracts with their analyses, used for the picker when nothing is selected
//   onOpen, onBack, onGoUpload   functions from App
export default function AnalysisPage({ contract, analysis, rows, onOpen, onBack, onGoUpload }) {
  // Nothing selected yet: let the user pick one of the analysed contracts.
  if (!contract || !analysis) {
    const analysedRows = rows.filter((row) => row.analysis);
    return (
      <div>
        <PageHeader title="Analysis" text="Choose an analysed contract to read its full review." />
        <div className="mt-6">
          {analysedRows.length === 0 ? (
            <EmptyState
              icon="shield"
              title="No analyses yet"
              text="Upload a contract and run an analysis to see its risk level, clauses and recommendations here."
              action={
                <button type="button" onClick={onGoUpload} className={primaryButton}>
                  Upload a contract
                </button>
              }
            />
          ) : (
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {analysedRows.map((row) => (
                <li key={row.contract.id}>
                  <button
                    type="button"
                    onClick={() => onOpen(row.contract.id)}
                    className={`${card} block w-full p-5 text-left transition-colors hover:border-sage hover:bg-sage-light`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 truncate font-medium">{row.contract.original_name}</p>
                      <RiskBadge level={row.analysis.overall_risk_level} />
                    </div>
                    <p className="mt-2 text-sm text-muted">
                      {row.analysis.contract_type} · analysed {formatDate(row.analysis.analysis_date)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  const flags = [...analysis.risk_flags].sort(
    (a, b) => SEVERITY_ORDER[a.risk_level] - SEVERITY_ORDER[b.risk_level]
  );
  const flagCounts = Object.fromEntries(RISK_LEVELS.map((level) => [level, 0]));
  flags.forEach((flag) => {
    flagCounts[flag.risk_level] += 1;
  });

  return (
    <div>
      <button type="button" onClick={onBack} className={secondaryButton}>
        <Icon name="back" className="h-4 w-4" />
        All contracts
      </button>

      <div className="mt-5">
        <p className={smallLabel}>{analysis.contract_type || "Contract"}</p>
        <h1 className="mt-2 break-words text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
          {contract.original_name}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Analysed {formatDateTime(analysis.analysis_date)}
        </p>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Right column on wide screens, first on small screens, so the risk level is the first thing you see. */}
        <aside className="space-y-6 xl:col-start-2 xl:row-start-1 xl:sticky xl:top-24 xl:self-start">
          <div className={`${card} p-6`}>
            <RiskMeter level={analysis.overall_risk_level} />
          </div>

          <div className={`${card} p-6`}>
            <h2 className="text-xl font-medium">Risk flags by severity</h2>
            <ul className="mt-4 space-y-2.5">
              {RISK_LEVELS.slice()
                .reverse()
                .map((level) => (
                  <li key={level} className="flex items-center justify-between text-sm">
                    <RiskBadge level={level} />
                    <span className="font-serif text-xl">{flagCounts[level]}</span>
                  </li>
                ))}
            </ul>
          </div>

          <div className={`${card} p-6`}>
            <h2 className="text-xl font-medium">Document</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Fact label="Uploaded" value={formatDate(contract.upload_date)} />
              <Fact label="Length" value={`${contract.word_count.toLocaleString("en-IN")} words`} />
              <Fact label="Type" value={analysis.contract_type || "Unknown"} />
            </dl>
          </div>
        </aside>

        <div className="min-w-0 space-y-6 xl:col-start-1 xl:row-start-1">
          <section className={`${card} p-5 sm:p-6`} aria-labelledby="summary-heading">
            <h2 id="summary-heading" className={smallLabel}>
              Executive summary
            </h2>
            <p className="mt-4 font-serif text-2xl leading-relaxed">
              {analysis.summary || "No summary was returned."}
            </p>
          </section>

          <section className={card} aria-labelledby="flags-heading">
            <SectionHeader id="flags-heading" title="Risk flags" count={flags.length} noun="flag" />
            {flags.length === 0 ? (
              <p className="p-6 text-muted">The analysis did not flag any risks.</p>
            ) : (
              <ul className="space-y-4 p-4 sm:p-6">
                {flags.map((flag, index) => (
                  <li
                    key={`${index}-${flag.risk_title}`}
                    className={`rounded-md border border-l-4 border-line bg-ivory p-5 ${RISK_BORDER[flag.risk_level] || ""}`}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <RiskBadge level={flag.risk_level} />
                      <h3 className="min-w-0 flex-1 text-xl font-medium">{flag.risk_title}</h3>
                    </div>
                    {flag.clause_reference && (
                      <p className="mt-2 text-sm text-muted">Refers to: {flag.clause_reference}</p>
                    )}
                    <p className="mt-3 leading-relaxed">{flag.description}</p>
                    <p className="mt-4 border-t border-line pt-4 leading-relaxed">
                      <span className="font-semibold text-forest">Recommendation. </span>
                      {flag.recommendation}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={card} aria-labelledby="clauses-heading">
            <SectionHeader id="clauses-heading" title="Key clauses" count={analysis.key_clauses.length} noun="clause" />
            {analysis.key_clauses.length === 0 ? (
              <p className="p-6 text-muted">No key clauses were returned.</p>
            ) : (
              <ul>
                {analysis.key_clauses.map((clause, index) => (
                  <li key={`${index}-${clause.clause_title}`} className="border-b border-line p-6 last:border-b-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-medium">{clause.clause_title}</h3>
                      <span
                        className={`rounded-sm px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                          clause.is_standard ? "bg-sage-light text-forest" : "bg-risk-medium-bg text-risk-medium"
                        }`}
                      >
                        {clause.is_standard ? "Standard" : "Non-standard"}
                      </span>
                    </div>
                    <blockquote className="mt-4 border-l-2 border-sage pl-4 font-serif italic leading-relaxed text-muted">
                      {clause.clause_text}
                    </blockquote>
                    <p className="mt-4 leading-relaxed">{clause.explanation}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={card} aria-labelledby="recs-heading">
            <SectionHeader
              id="recs-heading"
              title="Recommendations"
              count={analysis.recommendations.length}
              noun="item"
            />
            {analysis.recommendations.length === 0 ? (
              <p className="p-6 text-muted">No recommendations were returned.</p>
            ) : (
              <ol className="space-y-5 p-6">
                {analysis.recommendations.map((text, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-forest font-serif text-lg text-ivory">
                      {index + 1}
                    </span>
                    <p className="pt-1 leading-relaxed">{text}</p>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <p className="text-sm leading-relaxed text-muted">
            This analysis was generated by AI for preliminary review. It does not replace advice from a
            qualified lawyer.
          </p>
        </div>
      </div>
    </div>
  );
}

// Props: id, title, count, noun (singular word, "s" is added when count is not 1).
function SectionHeader({ id, title, count, noun }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line px-6 py-4">
      <h2 id={id} className="text-2xl font-medium">
        {title}
      </h2>
      <span className="text-sm text-muted">
        {count} {count === 1 ? noun : `${noun}s`}
      </span>
    </div>
  );
}

// A label and a value in the "Document" card. Props: label, value.
function Fact({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

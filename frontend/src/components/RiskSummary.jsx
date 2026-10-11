import { card } from "../styles";
import { RISK_FILL, RISK_LEVELS } from "./RiskBadge";

// Shows how the latest analyses are spread across the four risk levels.
// Props: riskCounts ({ low, medium, high, critical }), analysed (how many contracts have an analysis), flagCount.
export default function RiskSummary({ riskCounts, analysed, flagCount }) {
  return (
    <section className={`${card} p-6`} aria-labelledby="risk-overview-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="risk-overview-heading" className="text-2xl font-medium">
          Risk overview
        </h2>
        {analysed > 0 && (
          <p className="text-sm text-muted">
            {analysed} analysed {analysed === 1 ? "contract" : "contracts"} · {flagCount} risk{" "}
            {flagCount === 1 ? "flag" : "flags"}
          </p>
        )}
      </div>

      {analysed === 0 ? (
        <p className="mt-4 text-sm text-muted">
          Analyse a contract and its overall risk level will appear here.
        </p>
      ) : (
        <>
          {/* Each segment's width is its share of the analysed contracts. */}
          <div className="mt-5 flex h-3 overflow-hidden rounded-sm bg-ivory-dark" role="img" aria-label="Contracts by overall risk level">
            {RISK_LEVELS.map((level) =>
              riskCounts[level] > 0 ? (
                <div
                  key={level}
                  className={RISK_FILL[level]}
                  style={{ width: `${(riskCounts[level] / analysed) * 100}%` }}
                />
              ) : null
            )}
          </div>

          <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {RISK_LEVELS.map((level) => (
              <li key={level}>
                <p className="flex items-center gap-2 text-sm capitalize text-muted">
                  <span className={`h-2.5 w-2.5 rounded-sm ${RISK_FILL[level]}`} />
                  {level}
                </p>
                <p className="mt-1 font-serif text-3xl font-medium">{riskCounts[level]}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

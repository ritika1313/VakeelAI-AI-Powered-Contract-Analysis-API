// Small helper functions used by several components.

export function formatDate(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// The backend stores analyses separately from contracts and links them with
// contract_id. A contract can have several analyses, so we pick the newest.
export function latestAnalysisFor(contractId, analyses) {
  const matches = analyses.filter((a) => a.contract_id === contractId);
  if (matches.length === 0) return null;
  return matches.reduce((newest, a) =>
    a.analysis_date > newest.analysis_date ? a : newest
  );
}

// Turns the two raw lists from the API into everything the dashboard needs.
// Nothing here is invented: every number is counted from the real data.
export function buildStats(contracts, analyses) {
  const rows = contracts
    .map((contract) => ({
      contract,
      analysis: latestAnalysisFor(contract.id, analyses),
      analysisCount: analyses.filter((a) => a.contract_id === contract.id).length,
    }))
    .sort((a, b) => b.contract.upload_date.localeCompare(a.contract.upload_date));

  const riskCounts = { low: 0, medium: 0, high: 0, critical: 0 };
  let flagCount = 0;
  let analysed = 0;
  for (const { analysis } of rows) {
    if (!analysis) continue;
    analysed += 1;
    flagCount += analysis.risk_flags.length;
    if (analysis.overall_risk_level in riskCounts) {
      riskCounts[analysis.overall_risk_level] += 1;
    }
  }

  return {
    rows,
    total: contracts.length,
    analysed,
    pending: contracts.length - analysed,
    attention: riskCounts.high + riskCounts.critical,
    riskCounts,
    flagCount,
  };
}

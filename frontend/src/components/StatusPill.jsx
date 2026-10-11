import Spinner from "./Spinner";

// Shows whether a contract has been analysed. Props: analysed (true/false), busy (true while analysing).
export default function StatusPill({ analysed, busy }) {
  if (busy) {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-muted">
        <Spinner /> Analysing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className={`h-2 w-2 rounded-full ${analysed ? "bg-forest" : "bg-line"}`} />
      {analysed ? "Analysed" : "Not analysed"}
    </span>
  );
}

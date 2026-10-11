import { primaryButton, secondaryButton } from "../styles";
import Spinner from "./Spinner";

// The button shown for a contract: "View analysis" if one exists, otherwise "Analyse".
// Props:
//   contract, analysis  the record and its latest analysis (or null)
//   analysingId         id of the contract being analysed right now (or null)
//   onOpen(contractId)  show the analysis page; onAnalyse(contract) start an analysis
export default function ContractActions({ contract, analysis, analysingId, onOpen, onAnalyse }) {
  const isAnalysing = analysingId === contract.id;

  if (analysis) {
    return (
      <button type="button" onClick={() => onOpen(contract.id)} className={secondaryButton}>
        View analysis
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => onAnalyse(contract)}
      disabled={analysingId !== null}
      className={primaryButton}
    >
      {isAnalysing && <Spinner />}
      {isAnalysing ? "Analysing…" : "Analyse"}
    </button>
  );
}

import { useRef, useState } from "react";
import { analyseContract, uploadContract } from "../api";
import { formatSize } from "../utils";
import { card, primaryButton, secondaryButton } from "../styles";
import Icon from "./Icons";
import Notice from "./Notice";
import Spinner from "./Spinner";

// These mirror the limits in the backend's config.py.
const ALLOWED_EXTENSIONS = [".pdf", ".txt"];
const MAX_MB = 10;

// The two stages shown in the progress list.
const STEPS = [
  { id: "uploading", label: "Upload and read the file" },
  { id: "analysing", label: "Analyse with Gemini" },
];

// Works out how one step should look: "done", "active" or "pending".
function stepState(stepId, stage, uploaded) {
  if (stepId === "uploading") {
    if (stage === "uploading") return "active";
    return uploaded ? "done" : "pending";
  }
  return stage === "analysing" ? "active" : "pending";
}

// Props (data and functions passed down from App):
//   onUploaded(contract)           called when the file is saved
//   onAnalysed(contract, analysis) called when Gemini's analysis is back
export default function UploadPanel({ onUploaded, onAnalysed }) {
  // State: values that, when changed, make React redraw this component.
  const [file, setFile] = useState(null);
  const [stage, setStage] = useState("idle"); // idle | uploading | analysing | error
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState(null); // saved contract, if the analysis step failed
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null); // a handle to the hidden <input type="file">

  const busy = stage === "uploading" || stage === "analysing";
  const showSteps = busy || uploaded !== null;

  function chooseFile(newFile) {
    if (!newFile) return;

    const dot = newFile.name.lastIndexOf(".");
    const extension = dot === -1 ? "" : newFile.name.slice(dot).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setError("Only PDF or TXT files are supported.");
      setStage("error");
      return;
    }
    if (newFile.size > MAX_MB * 1024 * 1024) {
      setError(`This file is larger than ${MAX_MB} MB.`);
      setStage("error");
      return;
    }

    setFile(newFile);
    setUploaded(null);
    setError("");
    setStage("idle");
  }

  function handleDrop(event) {
    event.preventDefault(); // stop the browser from opening the file
    setDragging(false);
    if (!busy) chooseFile(event.dataTransfer.files[0]);
  }

  function handleRemove() {
    setFile(null);
    setUploaded(null);
    setError("");
    setStage("idle");
  }

  // Step 1: upload the file. Step 2: ask the backend to analyse it.
  async function handleAnalyse() {
    setError("");
    try {
      let contract = uploaded;
      if (!contract) {
        setStage("uploading");
        contract = await uploadContract(file);
        setUploaded(contract);
        onUploaded(contract);
      }
      setStage("analysing");
      const analysis = await analyseContract(contract.id);
      onAnalysed(contract, analysis);
      handleRemove(); // clear the form for next time
    } catch (err) {
      setError(err.message);
      setStage("error");
    }
  }

  let buttonLabel = "Analyse contract";
  if (stage === "uploading") buttonLabel = "Uploading…";
  else if (stage === "analysing") buttonLabel = "Analysing…";
  else if (uploaded) buttonLabel = "Retry analysis";

  return (
    <section id="upload" tabIndex={-1} aria-labelledby="upload-heading" className={`${card} p-6`}>
      <h2 id="upload-heading" className="text-2xl font-medium">
        Analyse a contract
      </h2>
      <p className="mt-1 text-sm text-muted">Upload a PDF or text file to get a structured review.</p>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`mt-5 rounded-md border border-dashed p-6 text-center transition-colors ${
          dragging ? "border-forest bg-sage-light" : "border-sage bg-ivory"
        }`}
      >
        {/* Conditional rendering: show the chosen file, or the "choose a file" prompt. */}
        {file ? (
          <div className="flex items-center gap-4 text-left">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-sage-light text-forest">
              <Icon name="file" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{file.name}</p>
              <p className="text-sm text-muted">{formatSize(file.size)}</p>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              disabled={busy}
              aria-label="Remove file"
              className="rounded-md p-2 text-muted hover:bg-sage-light disabled:opacity-50"
            >
              <Icon name="x" className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-sage-light text-forest">
              <Icon name="upload" className="h-6 w-6" />
            </span>
            <p className="mt-4 font-serif text-xl">Drag and drop your contract</p>
            <p className="mt-1 text-sm text-muted">PDF or TXT · up to {MAX_MB} MB</p>
            <button type="button" onClick={() => inputRef.current.click()} className={`${secondaryButton} mt-4`}>
              Choose a file
            </button>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt"
          className="sr-only"
          onChange={(event) => {
            chooseFile(event.target.files[0]);
            event.target.value = ""; // lets the same file be picked again
          }}
        />
      </div>

      {showSteps && (
        <ol className="mt-5 space-y-3" aria-label="Progress">
          {STEPS.map((step, index) => {
            const state = stepState(step.id, stage, uploaded);
            return (
              <li key={step.id} className="flex items-center gap-3 text-sm">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                    state === "done"
                      ? "border-forest bg-forest text-ivory"
                      : state === "active"
                        ? "border-forest text-forest"
                        : "border-line text-muted"
                  }`}
                >
                  {state === "done" ? <Icon name="check" className="h-3.5 w-3.5" /> : state === "active" ? <Spinner /> : index + 1}
                </span>
                <span className={state === "pending" ? "text-muted" : "font-medium"}>{step.label}</span>
              </li>
            );
          })}
        </ol>
      )}

      {stage === "analysing" && (
        <p role="status" className="mt-3 text-sm text-muted">
          Gemini is reading your contract. This can take a few minutes, so please keep this page open.
        </p>
      )}

      {stage === "error" && (
        <div className="mt-5">
          <Notice type="error">{error}</Notice>
        </div>
      )}

      <button
        type="button"
        onClick={handleAnalyse}
        disabled={busy || (!file && !uploaded)}
        className={`${primaryButton} mt-5 w-full py-3`}
      >
        {busy && <Spinner />}
        {buttonLabel}
      </button>

      <ul className="mt-5 space-y-1.5 text-xs leading-relaxed text-muted">
        <li>Scanned PDFs without selectable text are not supported.</li>
        <li>Only the first 15,000 characters of a long contract are analysed.</li>
        <li>Results are AI-generated and are not legal advice.</li>
      </ul>
    </section>
  );
}

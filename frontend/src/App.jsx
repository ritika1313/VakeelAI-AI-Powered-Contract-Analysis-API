import { useEffect, useState } from "react";
import { API_BASE_URL, analyseContract, checkApi, getAnalyses, getContracts } from "./api";
import Notice from "./components/Notice";
import Topbar from "./components/Topbar";
import AnalysisPage from "./pages/AnalysisPage";
import ContractsPage from "./pages/ContractsPage";
import DashboardPage from "./pages/DashboardPage";
import { buildStats, latestAnalysisFor } from "./utils";

// App is the parent component. It owns the data (state) that several pages
// share and passes it down to children as props.
export default function App() {
  // Data from the backend
  const [contracts, setContracts] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [listStatus, setListStatus] = useState("loading"); // loading | ready | error
  const [listError, setListError] = useState("");
  const [refreshError, setRefreshError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [apiStatus, setApiStatus] = useState({ state: "checking", message: "" });

  // What the user is looking at
  const [page, setPage] = useState("dashboard"); // dashboard | contracts | analysis
  const [selectedId, setSelectedId] = useState(null); // contract shown on the analysis page
  const [notice, setNotice] = useState(null); // { type, text } feedback bar

  // Analysing a contract from a list row
  const [analysingId, setAnalysingId] = useState(null);
  const [rowError, setRowError] = useState(null); // { id, message }

  // Fetch both lists from the backend (GET /contracts/ and GET /analysis/).
  async function loadAll() {
    setRefreshing(true);
    setRefreshError("");
    if (listStatus !== "ready") setListStatus("loading");
    checkApi().then(setApiStatus);
    try {
      const [contractList, analysisList] = await Promise.all([getContracts(), getAnalyses()]);
      setContracts(contractList);
      setAnalyses(analysisList);
      setListError("");
      setListStatus("ready");
    } catch (err) {
      setListError(err.message);
      setRefreshError(err.message);
      if (listStatus !== "ready") setListStatus("error");
    } finally {
      setRefreshing(false);
    }
  }

  // useEffect with [] runs once, right after the first render.
  useEffect(() => {
    loadAll();
  }, []);

  function navigate(nextPage) {
    setPage(nextPage);
    setNotice(null);
    window.scrollTo(0, 0);
  }

  function handleGoUpload() {
    navigate("dashboard");
    requestAnimationFrame(() => {
      const uploadPanel = document.getElementById("upload");
      uploadPanel?.scrollIntoView({ behavior: "smooth", block: "center" });
      uploadPanel?.focus({ preventScroll: true });
      uploadPanel?.querySelector('input[type="file"]')?.click();
    });
  }

  function handleOpen(contractId) {
    setSelectedId(contractId);
    navigate("analysis");
  }

  // Add to an array without changing the old one: [...old, newItem].
  function handleUploaded(contract) {
    setContracts((previous) => [...previous, contract]);
  }

  function handleAnalysed(contract, analysis) {
    setAnalyses((previous) => [...previous, analysis]);
    handleOpen(contract.id);
    setNotice({ type: "success", text: `${contract.original_name} was analysed successfully.` });
  }

  // Analyse a contract that was uploaded earlier but has no analysis yet.
  async function handleAnalyse(contract) {
    setAnalysingId(contract.id);
    setRowError(null);
    try {
      const analysis = await analyseContract(contract.id);
      handleAnalysed(contract, analysis);
    } catch (err) {
      setRowError({ id: contract.id, message: err.message });
    } finally {
      setAnalysingId(null);
    }
  }

  const data = buildStats(contracts, analyses);
  const selectedContract = contracts.find((c) => c.id === selectedId) || null;
  const selectedAnalysis = selectedContract ? latestAnalysisFor(selectedContract.id, analyses) : null;

  return (
    <div className="min-h-screen">
      <Topbar
        page={page}
        onNavigate={navigate}
        contractCount={contracts.length}
        onRefresh={loadAll}
        refreshing={refreshing}
        onUpload={handleGoUpload}
      />

      <main className="mx-auto w-full max-w-[88rem] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {apiStatus.state === "wrong" && (
          <div className="mb-6">
            <Notice type="error">
              <p className="font-medium">This is not the Vakeel backend.</p>
              <p className="mt-1">{apiStatus.message} Check VITE_API_BASE_URL in frontend/.env and restart npm run dev.</p>
            </Notice>
          </div>
        )}

        {refreshError && listStatus === "ready" && (
          <div className="mb-6">
            <Notice type="error" onDismiss={() => setRefreshError("")}>
              Dashboard data could not be refreshed: {refreshError}
            </Notice>
          </div>
        )}

        {notice && (
          <div className="mb-6">
            <Notice type={notice.type} onDismiss={() => setNotice(null)}>
              {notice.text}
            </Notice>
          </div>
        )}

        {/* Conditional rendering: one page at a time. */}
        {page === "dashboard" && (
          <DashboardPage
            data={data}
            status={listStatus}
            error={listError}
            onRetry={loadAll}
            onOpen={handleOpen}
            onAnalyse={handleAnalyse}
            analysingId={analysingId}
            rowError={rowError}
            onViewAll={() => navigate("contracts")}
            onUploaded={handleUploaded}
            onAnalysed={handleAnalysed}
          />
        )}
        {page === "contracts" && (
          <ContractsPage
            rows={data.rows}
            status={listStatus}
            error={listError}
            onRetry={loadAll}
            onOpen={handleOpen}
            onAnalyse={handleAnalyse}
            analysingId={analysingId}
            rowError={rowError}
            onGoUpload={() => navigate("dashboard")}
          />
        )}
        {page === "analysis" && (
          <AnalysisPage
            contract={selectedContract}
            analysis={selectedAnalysis}
            rows={data.rows}
            onOpen={handleOpen}
            onBack={() => navigate("contracts")}
            onGoUpload={() => navigate("dashboard")}
          />
        )}
      </main>
    </div>
  );
}

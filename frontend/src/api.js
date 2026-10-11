// All communication with the FastAPI backend lives in this one file.
// Components never call fetch directly, they call these small functions.

// Clean up the value from .env so a small typo cannot break every request.
// Example: "localhost:8000" (no http://) would otherwise be treated by the browser
// as a path on the Vite dev server, and every request would come back 404.
function cleanBaseUrl(value) {
  const raw = (value || "").trim().replace(/^["']|["']$/g, "");
  let url = raw || "http://localhost:8000";
  if (!/^https?:\/\//i.test(url)) url = `http://${url}`;
  return url.replace(/\/+$/, "");
}

export const API_BASE_URL = cleanBaseUrl(import.meta.env.VITE_API_BASE_URL);
console.info("Vakeel API base URL:", API_BASE_URL);

// One helper that every request goes through.
// It turns network failures and FastAPI error responses ({ "detail": "..." })
// into a normal JavaScript Error with a readable message.
async function request(path, options = {}) {
  const method = options.method || "GET";
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch {
    throw new Error(
      `Cannot reach the server at ${API_BASE_URL}. Check that the backend is running and that CORS_ORIGINS allows this page.`
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // The response had no JSON body, which is fine for the error case below.
  }

  if (!response.ok) {
    const detail = data && typeof data.detail === "string" ? data.detail : "";
    // FastAPI answers {"detail": "Not Found"} when no route matches at all.
    // That means the request reached a server that is not serving this route.
    if (response.status === 404 && detail === "Not Found") {
      throw new Error(
        `The server at ${API_BASE_URL} has no route ${method} ${path}. Check VITE_API_BASE_URL and make sure the Vakeel backend is the one running on that port.`
      );
    }
    throw new Error(detail || `The server returned an error (status ${response.status}).`);
  }
  return data;
}

// GET /  ->  { app: "Vakeel Contracts API", ... }
// Used by the sidebar to show whether the frontend is talking to the right server.

export async function checkApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    const data = await response.json().catch(() => null);

    if (
      response.ok &&
      data?.app === "Vakeel Contracts API"
    ) {
      return {
        state: "online",
        message: "Backend connected",
      };
    }

    return {
      state: "wrong",
      message: `Unexpected API response from ${API_BASE_URL}.`,
    };
  } catch {
    return {
      state: "offline",
      message: `Cannot reach ${API_BASE_URL}.`,
    };
  }
}


// GET /contracts/  ->  { contracts: [...] }
export function getContracts() {
  return request("/contracts/").then((data) => data.contracts);
}

// GET /analysis/  ->  { analyses: [...] }
export function getAnalyses() {
  return request("/analysis/").then((data) => data.analyses);
}

// POST /contracts/upload  (multipart form, field name "file")  ->  { contract, id, message }
export function uploadContract(file) {
  const form = new FormData();
  form.append("file", file);
  // Do not set a Content-Type header here: the browser adds the correct
  // multipart header (with its boundary) automatically for FormData.
  return request("/contracts/upload", { method: "POST", body: form }).then(
    (data) => data.contract
  );
}

// POST /analysis/analyse/{contract_id}  ->  { analysis, id, message }
export function analyseContract(contractId) {
  return request(`/analysis/analyse/${contractId}`, { method: "POST" }).then(
    (data) => data.analysis
  );
}

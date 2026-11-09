const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// Clerk's getToken (from useAuth) — the API requires a bearer token on every /v1 route.
export type TokenGetter = (options?: { skipCache?: boolean }) => Promise<string | null>;

async function authHeaders(getToken: TokenGetter): Promise<Record<string, string>> {
  let token = await getToken();
  if (!token) token = await getToken({ skipCache: true });
  if (!token) throw new Error("No session token — please sign out and sign back in.");
  return { Authorization: `Bearer ${token}` };
}

async function failureMessage(res: Response, fallback: string): Promise<string> {
  if (res.status === 401) return "API rejected your credentials — please sign out and sign back in.";
  // 429 and other errors carry a readable message in `detail` (e.g. "Rate limit reached…")
  const err = await res.json().catch(() => ({}));
  return typeof err.detail === "string" ? err.detail : `${fallback}: ${res.status}`;
}

export interface Citation {
  slug: string;
  name: string;
  sector: string;
  chunk_idx: number;
  chunk_count: number;
  score: number;
  text: string;
  source_url: string;
}

export interface QueryResponse {
  answer: string;
  citations: Citation[];
  retrieval_ms: number;
  answer_ms: number;
}

export interface Source {
  slug: string;
  name: string;
  sector: string;
  files: number;
  chunks: number;
}

export interface IngestResponse {
  status: string;
  filename: string;
  chunks: number;
  message: string;
}

export async function queryCopus(
  getToken: TokenGetter,
  question: string,
  sector?: string,
  slug?: string,
): Promise<QueryResponse> {
  const res = await fetch(`${API_URL}/v1/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders(getToken)) },
    body: JSON.stringify({ question, sector: sector ?? null, slug: slug ?? null, top_k: 8 }),
  });
  if (!res.ok) throw new Error(await failureMessage(res, "Request failed"));
  return res.json();
}

export async function ingestFile(
  getToken: TokenGetter,
  file: File,
  sector: string = "cross",
): Promise<IngestResponse> {
  const form = new FormData();
  form.append("file", file);
  form.append("sector", sector);
  const res = await fetch(`${API_URL}/v1/ingest`, {
    method: "POST",
    headers: await authHeaders(getToken),
    body: form,
  });
  if (res.status === 403) {
    // /v1/ingest writes to the shared public corpus, so the API restricts it to admins
    // until per-customer document upload ships.
    throw new Error("Document upload isn't available on trial accounts yet. It is coming with the pilot.");
  }
  if (!res.ok) throw new Error(await failureMessage(res, "Upload failed"));
  return res.json();
}

export async function getSources(getToken: TokenGetter): Promise<Source[]> {
  const res = await fetch(`${API_URL}/v1/sources`, { headers: await authHeaders(getToken) });
  if (!res.ok) return [];
  return res.json();
}

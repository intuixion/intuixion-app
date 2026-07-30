const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

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
  question: string,
  sector?: string,
  slug?: string,
): Promise<QueryResponse> {
  const res = await fetch(`${API_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, sector: sector ?? null, slug: slug ?? null, top_k: 8 }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function ingestFile(
  file: File,
  sector: string = "cross",
): Promise<IngestResponse> {
  const form = new FormData();
  form.append("file", file);
  form.append("sector", sector);
  const res = await fetch(`${API_URL}/ingest`, { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? `Upload failed: ${res.status}`);
  }
  return res.json();
}

export async function getSources(): Promise<Source[]> {
  const res = await fetch(`${API_URL}/sources`);
  if (!res.ok) return [];
  return res.json();
}

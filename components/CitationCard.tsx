"use client";
import { ExternalLink, FileText } from "lucide-react";
import type { Citation } from "@/lib/api";

const SECTOR_COLOURS: Record<string, string> = {
  healthcare: "#16a34a",
  financial:  "#0c2340",
  retail:     "#b45309",
  cross:      "#0d9488",
};

function scoreColour(score: number) {
  if (score >= 0.65) return "#16a34a";
  if (score >= 0.50) return "#b45309";
  return "#9aa0a6";
}

const SECTOR_LABELS: Record<string, string> = {
  healthcare: "Healthcare",
  financial:  "Financial",
  retail:     "Labour & Retail",
  cross:      "Cross-sector",
};

interface Props {
  citation: Citation;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}

export default function CitationCard({ citation, index, expanded, onToggle }: Props) {
  const colour = SECTOR_COLOURS[citation.sector] ?? "#9aa0a6";
  const pct    = Math.round(citation.score * 100);

  return (
    <div
      onClick={onToggle}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        cursor: "pointer",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
      className="p-3 hover:border-[var(--primary)] hover:shadow-sm select-none"
    >
      <div className="flex items-start gap-2">
        <div
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6 }}
          className="shrink-0 w-6 h-6 flex items-center justify-center mt-0.5"
        >
          <FileText size={12} style={{ color: "var(--muted)" }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <span style={{ background: colour + "15", color: colour, border: `1px solid ${colour}30`, borderRadius: 4, fontSize: 10, fontWeight: 600, padding: "1px 6px", letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
              {SECTOR_LABELS[citation.sector] ?? citation.sector}
            </span>
            <span style={{ color: "var(--text-dim)", fontSize: 10 }}>[{index + 1}]</span>
          </div>
          <p style={{ color: "var(--text)", fontSize: 13, fontWeight: 500, margin: 0 }} className="truncate">
            {citation.name}
          </p>
          <p style={{ color: "var(--text-dim)", fontSize: 11, margin: "2px 0 0" }}>
            passage {citation.chunk_idx + 1} of {citation.chunk_count}
          </p>
        </div>

        <div style={{ background: scoreColour(pct / 100) + "18", color: scoreColour(pct / 100), border: `1px solid ${scoreColour(pct / 100)}30`, borderRadius: 6, fontSize: 11, fontWeight: 600, padding: "2px 8px", whiteSpace: "nowrap" as const }}>
          {pct}%
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: "1px solid var(--border)", marginTop: 10, paddingTop: 10 }}>
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            {citation.text}
          </p>
          {citation.source_url && (
            <a
              href={citation.source_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ color: "var(--primary)", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8, fontWeight: 500 }}
            >
              <ExternalLink size={11} /> View source document
            </a>
          )}
        </div>
      )}
    </div>
  );
}

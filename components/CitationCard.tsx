"use client";
import { ExternalLink, FileText } from "lucide-react";
import type { Citation } from "@/lib/api";

const SECTOR_COLOURS: Record<string, string> = {
  healthcare: "#22c55e",
  financial: "#7c6fff",
  retail: "#f59e0b",
  cross: "#22d3ee",
};

function scoreColour(score: number) {
  if (score >= 0.65) return "#22c55e";
  if (score >= 0.50) return "#f59e0b";
  return "#7878a0";
}

interface Props {
  citation: Citation;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}

export default function CitationCard({ citation, index, expanded, onToggle }: Props) {
  const sectorColour = SECTOR_COLOURS[citation.sector] ?? "#7878a0";
  const pct = Math.round(citation.score * 100);

  return (
    <div
      onClick={onToggle}
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        cursor: "pointer",
        transition: "border-color 0.15s",
      }}
      className="p-3 hover:border-[var(--primary)] select-none"
    >
      {/* Header row */}
      <div className="flex items-start gap-2">
        <div
          style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6 }}
          className="shrink-0 w-6 h-6 flex items-center justify-center"
        >
          <FileText size={12} style={{ color: "var(--text-dim)" }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              style={{
                background: sectorColour + "22",
                color: sectorColour,
                borderRadius: 4,
                fontSize: 10,
                padding: "1px 6px",
              }}
            >
              {citation.sector}
            </span>
            <span style={{ color: "var(--text-dim)", fontSize: 10 }}>
              [{index + 1}]
            </span>
          </div>
          <p
            style={{ color: "var(--text)", fontSize: 12, fontWeight: 500, margin: "2px 0 0" }}
            className="truncate"
          >
            {citation.name}
          </p>
          <p style={{ color: "var(--text-dim)", fontSize: 11, margin: "1px 0 0" }}>
            chunk {citation.chunk_idx + 1} of {citation.chunk_count}
          </p>
        </div>

        {/* Score badge */}
        <div
          style={{
            background: scoreColour(citation.score) + "20",
            color: scoreColour(citation.score),
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            padding: "2px 8px",
            whiteSpace: "nowrap",
          }}
        >
          {pct}%
        </div>
      </div>

      {/* Expandable excerpt */}
      {expanded && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            marginTop: 8,
            paddingTop: 8,
          }}
        >
          <p
            style={{
              color: "var(--text-dim)",
              fontSize: 12,
              lineHeight: 1.6,
              margin: 0,
              fontFamily: "monospace",
            }}
          >
            {citation.text}
          </p>
          {citation.source_url && (
            <a
              href={citation.source_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ color: "var(--primary)", fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6 }}
            >
              <ExternalLink size={10} /> Source document
            </a>
          )}
        </div>
      )}
    </div>
  );
}

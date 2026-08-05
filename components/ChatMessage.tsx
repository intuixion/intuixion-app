"use client";
import { useState } from "react";
import { Clock } from "lucide-react";
import CitationCard from "./CitationCard";
import type { Citation } from "@/lib/api";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  retrieval_ms?: number;
  answer_ms?: number;
  error?: boolean;
}

function formatMs(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}

function BrandMark() {
  return (
    <div style={{ width: 32, height: 32, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" width="32" height="32">
        <rect width="56" height="56" rx="12" fill="#0c2340"/>
        <line x1="33" y1="24" x2="50" y2="11" stroke="#2dd4bf" strokeWidth="5.5" strokeLinecap="round"/>
        <line x1="23" y1="28" x2="7"  y2="44" stroke="#2dd4bf" strokeWidth="5.5" strokeLinecap="round"/>
        <circle cx="28" cy="11" r="8" fill="#ffffff"/>
        <rect x="22" y="22" width="12" height="28" rx="6" fill="#ffffff"/>
      </svg>
    </div>
  );
}

export default function ChatMessage({ msg }: { msg: Message }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const isUser = msg.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div
          style={{
            background: "var(--primary)",
            color: "white",
            borderRadius: "12px 12px 3px 12px",
            padding: "10px 16px",
            fontSize: 14,
            lineHeight: 1.65,
            maxWidth: "72%",
          }}
          dangerouslySetInnerHTML={{ __html: formatAnswer(msg.content) }}
        />
      </div>
    );
  }

  return (
    <div className="flex gap-3 justify-start">
      <div className="mt-0.5">
        <BrandMark />
      </div>

      <div style={{ maxWidth: "80%" }} className="flex flex-col gap-2">
        {/* Answer — document card, not a bubble */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderLeft: msg.error ? "3px solid var(--danger)" : "3px solid var(--accent)",
            borderRadius: "0 8px 8px 8px",
            padding: "12px 16px",
          }}
        >
          <div
            className="answer-prose"
            style={{
              color: msg.error ? "var(--danger)" : "var(--text)",
              fontSize: 14,
              lineHeight: 1.75,
              whiteSpace: "pre-wrap",
            }}
            dangerouslySetInnerHTML={{ __html: formatAnswer(msg.content) }}
          />
        </div>

        {/* Timing */}
        {msg.retrieval_ms != null && (
          <div className="flex items-center gap-2 px-1">
            <Clock size={10} style={{ color: "var(--text-dim)" }} />
            <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
              retrieval {formatMs(msg.retrieval_ms)} · answer {formatMs(msg.answer_ms ?? 0)}
            </span>
          </div>
        )}

        {/* Citations */}
        {msg.citations && msg.citations.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p style={{ fontSize: 11, color: "var(--text-dim)", margin: "2px 0 0 2px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              {msg.citations.length} source{msg.citations.length > 1 ? "s" : ""}
            </p>
            {msg.citations.map((c, i) => (
              <CitationCard
                key={`${c.slug}-${c.chunk_idx}`}
                citation={c}
                index={i}
                expanded={expandedIdx === i}
                onToggle={() => setExpandedIdx(expandedIdx === i ? null : i)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function formatAnswer(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^(\d+\.\s)/gm, "<br/>$1")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>");
}

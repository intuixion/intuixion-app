"use client";
import { useState } from "react";
import { User, Bot, Clock } from "lucide-react";
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

export default function ChatMessage({ msg }: { msg: Message }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const isUser = msg.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {/* Avatar */}
      {!isUser && (
        <div
          style={{
            background: msg.error ? "#ef444430" : "var(--primary)30",
            border: `1px solid ${msg.error ? "#ef4444" : "var(--primary)"}`,
            borderRadius: 8,
            flexShrink: 0,
          }}
          className="w-8 h-8 flex items-center justify-center mt-0.5"
        >
          <Bot size={15} style={{ color: msg.error ? "#ef4444" : "var(--primary)" }} />
        </div>
      )}

      <div style={{ maxWidth: "80%" }} className="flex flex-col gap-2">
        {/* Bubble */}
        <div
          style={{
            background: isUser ? "var(--primary)" : "var(--surface-2)",
            border: `1px solid ${isUser ? "transparent" : msg.error ? "#ef444440" : "var(--border)"}`,
            borderRadius: isUser ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
            padding: "10px 14px",
          }}
        >
          <div
            className="answer-prose"
            style={{
              color: isUser ? "white" : msg.error ? "#fca5a5" : "var(--text)",
              fontSize: 14,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}
            dangerouslySetInnerHTML={{ __html: formatAnswer(msg.content) }}
          />
        </div>

        {/* Timing */}
        {!isUser && msg.retrieval_ms != null && (
          <div className="flex items-center gap-3 px-1">
            <Clock size={10} style={{ color: "var(--text-dim)" }} />
            <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
              retrieval {formatMs(msg.retrieval_ms)} · answer {formatMs(msg.answer_ms ?? 0)}
            </span>
          </div>
        )}

        {/* Citations */}
        {!isUser && msg.citations && msg.citations.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p style={{ fontSize: 11, color: "var(--text-dim)", margin: "2px 0 0 4px" }}>
              {msg.citations.length} source{msg.citations.length > 1 ? "s" : ""} — click to expand
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

      {isUser && (
        <div
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, flexShrink: 0 }}
          className="w-8 h-8 flex items-center justify-center mt-0.5"
        >
          <User size={14} style={{ color: "var(--text-dim)" }} />
        </div>
      )}
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

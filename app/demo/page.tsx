"use client";
import { useEffect, useRef, useState } from "react";
import { Send, Loader, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import ChatMessage, { type Message } from "@/components/ChatMessage";
import FileUpload from "@/components/FileUpload";
import { queryCopus, getSources, type Source } from "@/lib/api";

const SUGGESTED = [
  "What are the conditions for lawful processing of personal information under POPIA?",
  "What is reckless credit under the National Credit Act?",
  "What are the prescribed minimum benefits all medical schemes must cover?",
  "What are director duties under the Companies Act?",
  "What is the role of the Prudential Authority under the FSRA?",
];

const SECTORS = [
  { value: "", label: "All sectors" },
  { value: "cross", label: "Cross-sector" },
  { value: "healthcare", label: "Healthcare" },
  { value: "financial", label: "Financial" },
  { value: "retail", label: "Labour & Retail" },
];

// Pilot demo mode — driven by env vars so the UI activates without Clerk metadata.
// Change these in .env.local (or Vercel env) before each client demo.
const PILOT_ORG   = process.env.NEXT_PUBLIC_PILOT_ORG   ?? "";
const PILOT_SEATS = process.env.NEXT_PUBLIC_PILOT_SEATS  ?? "";
const PILOT_ROLE  = process.env.NEXT_PUBLIC_PILOT_ROLE   ?? "Admin";

export default function DemoPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sector, setSector] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [sectorOpen, setSectorOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    getSources().then(setSources).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(question: string) {
    if (!question.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: question };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await queryCopus(question, sector || undefined);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.answer,
        citations: res.citations,
        retrieval_ms: res.retrieval_ms,
        answer_ms: res.answer_ms,
      };
      setMessages((m) => [...m, assistantMsg]);
    } catch (err: unknown) {
      setMessages((m) => [
        ...m,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: err instanceof Error ? err.message : "Something went wrong. Please try again.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const selectedSector = SECTORS.find((s) => s.value === sector);
  const rawPassages   = sources.reduce((a, s) => a + s.chunks, 0);
  const rawSources    = sources.length;
  // Show actual corpus numbers when API is live; fall back to known corpus size for demo
  const totalPassages = rawPassages > 0 ? rawPassages : 18125;
  const totalSources  = rawSources  > 0 ? rawSources  : 30;
  const isDemo        = rawPassages === 0;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }} className="flex flex-col h-screen">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ─────────────────────────────────────────────── */}
        <aside
          style={{
            width: 256,
            borderRight: "1px solid var(--border)",
            background: "var(--surface)",
          }}
          className="hidden md:flex flex-col shrink-0 overflow-y-auto min-h-0"
        >
          {/* Account panel — visible when NEXT_PUBLIC_PILOT_ORG is set */}
          {PILOT_ORG && (
            <div style={{ padding: "16px 16px 14px", borderBottom: "1px solid var(--border)" }}>
              <p style={{ fontSize: 10, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, margin: "0 0 8px" }}>
                Account
              </p>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", margin: "0 0 8px", letterSpacing: "-0.2px" }}>
                {PILOT_ORG}
              </p>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                <span style={{ background: "#0c234015", color: "#0c2340", border: "1px solid #0c234030", borderRadius: 99, fontSize: 11, fontWeight: 600, padding: "2px 9px" }}>
                  {PILOT_ROLE}
                </span>
                {PILOT_SEATS && (
                  <span style={{ background: "var(--surface-2)", color: "var(--muted)", border: "1px solid var(--border)", borderRadius: 99, fontSize: 11, padding: "2px 9px" }}>
                    {PILOT_SEATS} seats
                  </span>
                )}
                <span style={{ background: "#16a34a12", color: "#16a34a", border: "1px solid #16a34a30", borderRadius: 99, fontSize: 11, padding: "2px 9px" }}>
                  Managed pilot
                </span>
              </div>
            </div>
          )}

          {/* Knowledge base stats */}
          <div style={{ padding: "20px 16px 0" }}>
            <p style={{ fontSize: 10, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, margin: "0 0 10px" }}>
              Knowledge base
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px" }}>
                <p style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", margin: 0, fontVariantNumeric: "tabular-nums" }}>
                  {totalPassages.toLocaleString()}
                </p>
                <p style={{ fontSize: 11, color: "var(--text-dim)", margin: "2px 0 0" }}>passages</p>
              </div>
              <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px" }}>
                <p style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", margin: 0, fontVariantNumeric: "tabular-nums" }}>
                  {totalSources}
                </p>
                <p style={{ fontSize: 11, color: "var(--text-dim)", margin: "2px 0 0" }}>sources</p>
              </div>
            </div>
          </div>

          {/* Sector filter */}
          <div style={{ padding: "20px 16px 0" }}>
            <p style={{ fontSize: 10, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, margin: "0 0 8px" }}>
              Filter by sector
            </p>
            <div className="flex flex-col gap-0.5">
              {SECTORS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSector(s.value)}
                  style={{
                    background: sector === s.value ? "var(--primary)" : "transparent",
                    border: "none",
                    borderRadius: 6,
                    color: sector === s.value ? "white" : "var(--muted)",
                    padding: "7px 10px",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: sector === s.value ? 500 : 400,
                    transition: "all 0.1s",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Upload */}
          <div style={{ padding: "20px 16px 0" }}>
            <p style={{ fontSize: 10, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, margin: "0 0 8px" }}>
              Your documents
            </p>
            <FileUpload
              onIngested={(name, chunks) => {
                setSources((prev) => [
                  ...prev,
                  { slug: `custom__${name}`, name, sector: "cross", files: 1, chunks },
                ]);
              }}
            />
          </div>

          {/* Demo mode indicator */}
          {isDemo && (
            <div style={{ margin: "16px 16px 0", padding: "8px 12px", background: "#0d948810", border: "1px solid #0d948830", borderRadius: 8 }}>
              <p style={{ fontSize: 11, color: "#0d9488", margin: 0, fontWeight: 500 }}>Demo corpus active</p>
              <p style={{ fontSize: 10, color: "var(--text-dim)", margin: "2px 0 0" }}>30 SA regulatory sources · refreshed monthly</p>
            </div>
          )}

          {/* Sources list */}
          {sources.length > 0 && (
            <div style={{ padding: "20px 16px", flex: 1 }}>
              <p style={{ fontSize: 10, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, margin: "0 0 8px" }}>
                Loaded sources
              </p>
              <div className="flex flex-col gap-1">
                {sources
                  .filter((s) => !sector || s.sector === sector)
                  .slice(0, 12)
                  .map((s) => (
                    <div
                      key={s.slug}
                      style={{
                        padding: "7px 10px",
                        borderRadius: 6,
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      <p style={{ fontSize: 12, color: "var(--text)", margin: 0, fontWeight: 500 }} className="truncate">
                        {s.name}
                      </p>
                      <p style={{ fontSize: 11, color: "var(--text-dim)", margin: "2px 0 0" }}>
                        {s.chunks.toLocaleString()} passages
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
          {/* Governance panel — always visible */}
          <div style={{ marginTop: "auto", padding: "16px", borderTop: "1px solid var(--border)" }}>
            <p style={{ fontSize: 10, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, margin: "0 0 10px" }}>
              Access &amp; audit
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>Query log</span>
                <span style={{ fontSize: 11, color: "var(--text)", fontWeight: 500 }}>Full history</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>Data residency</span>
                <span style={{ fontSize: 11, color: "#0d9488", fontWeight: 500 }}>🇿🇦 South Africa</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>Encryption</span>
                <span style={{ fontSize: 11, color: "var(--text)", fontWeight: 500 }}>AES-256 · TLS 1.3</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>POPIA status</span>
                <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 500 }}>✓ Compliant</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main area ──────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-6 min-h-0" style={{ padding: "32px 40px" }}>
            {messages.length === 0 && (
              <div className="flex flex-col items-center gap-8 text-center" style={{ maxWidth: 600, margin: "0 auto", width: "100%", paddingTop: "8vh" }}>
                <div>
                  {/* Logo lockup */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 24 }}>
                    <div style={{ borderRadius: 14, overflow: "hidden", flexShrink: 0 }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" width="56" height="56">
                        <rect width="56" height="56" rx="14" fill="#0c2340"/>
                        <line x1="33" y1="24" x2="50" y2="11" stroke="#2dd4bf" strokeWidth="5.5" strokeLinecap="round"/>
                        <line x1="23" y1="28" x2="7"  y2="44" stroke="#2dd4bf" strokeWidth="5.5" strokeLinecap="round"/>
                        <circle cx="28" cy="11" r="8" fill="#ffffff"/>
                        <rect x="22" y="22" width="12" height="28" rx="6" fill="#ffffff"/>
                      </svg>
                    </div>
                    <span style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: "normal", color: "var(--text)", letterSpacing: "-0.5px", lineHeight: 1 }}>
                      intuix<span style={{ color: "#2dd4bf" }}>ion</span>.ai
                    </span>
                  </div>
                  <h1 style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: "normal", color: "var(--text)", margin: "0 0 10px", letterSpacing: "-0.3px", lineHeight: 1.3 }}>
                    What do you need to know?
                  </h1>
                  <p style={{ color: "var(--muted)", fontSize: 15, margin: 0, lineHeight: 1.7 }}>
                    Ask anything about SA law or regulation in plain language.<br/>
                    Every answer surfaces with the exact source and section.
                  </p>
                </div>

                <div style={{ width: "100%", textAlign: "left" }}>
                  <p style={{ fontSize: 11, color: "var(--text-dim)", margin: "0 0 12px", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
                    Professionals often ask
                  </p>
                  <div className="flex flex-col">
                    {SUGGESTED.map((q) => (
                      <button
                        key={q}
                        onClick={() => send(q)}
                        style={{
                          background: "transparent",
                          border: "none",
                          borderBottom: "1px solid var(--border)",
                          color: "var(--text)",
                          padding: "13px 0",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: 14,
                          lineHeight: 1.5,
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 12,
                          transition: "color 0.1s",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget.querySelector(".q-dash") as HTMLElement).style.color = "var(--accent)"; }}
                        onMouseLeave={(e) => { (e.currentTarget.querySelector(".q-dash") as HTMLElement).style.color = "var(--border)"; }}
                      >
                        <span className="q-dash" style={{ color: "var(--border)", fontFamily: "Georgia, serif", fontSize: 16, flexShrink: 0, transition: "color 0.1s" }}>—</span>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <ChatMessage key={msg.id} msg={msg} />
            ))}

            {loading && (
              <div className="flex gap-3">
                <div style={{ width: 32, height: 32, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" width="32" height="32">
                    <rect width="56" height="56" rx="12" fill="#0c2340"/>
                    <line x1="33" y1="24" x2="50" y2="11" stroke="#2dd4bf" strokeWidth="5.5" strokeLinecap="round"/>
                    <line x1="23" y1="28" x2="7"  y2="44" stroke="#2dd4bf" strokeWidth="5.5" strokeLinecap="round"/>
                    <circle cx="28" cy="11" r="8" fill="#ffffff"/>
                    <rect x="22" y="22" width="12" height="28" rx="6" fill="#ffffff"/>
                  </svg>
                </div>
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderLeft: "3px solid var(--accent)", borderRadius: "0 8px 8px 8px", padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: "var(--accent)",
                        animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── Input bar ─────────────────────────────────────────── */}
          <div style={{ borderTop: "1px solid var(--border)", background: "var(--surface)", padding: "16px 40px 20px" }} className="shrink-0">
            {/* Mobile sector + upload toggles */}
            <div className="flex gap-2 mb-3 md:hidden">
              <div className="relative">
                <button
                  onClick={() => setSectorOpen(!sectorOpen)}
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--muted)",
                    fontSize: 12,
                    padding: "6px 10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {selectedSector?.label} <ChevronDown size={12} />
                </button>
                {sectorOpen && (
                  <div style={{ position: "absolute", bottom: "100%", left: 0, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, marginBottom: 4, zIndex: 10, minWidth: 160, boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}>
                    {SECTORS.map((s) => (
                      <button key={s.value} onClick={() => { setSector(s.value); setSectorOpen(false); }}
                        style={{ display: "block", width: "100%", padding: "9px 14px", background: "transparent", border: "none", color: sector === s.value ? "var(--primary)" : "var(--text)", fontSize: 13, textAlign: "left", cursor: "pointer", fontWeight: sector === s.value ? 600 : 400 }}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowUpload(!showUpload)}
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--muted)", fontSize: 12, padding: "6px 10px", cursor: "pointer" }}
              >
                + Upload PDF
              </button>
            </div>

            {showUpload && (
              <div className="mb-3 md:hidden">
                <FileUpload onIngested={() => setShowUpload(false)} />
              </div>
            )}

            {/* Query input */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                display: "flex",
                alignItems: "flex-end",
                gap: 10,
                padding: "10px 10px 10px 16px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
              className="focus-within:border-[var(--primary)] focus-within:shadow-md"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about POPIA, the NCA, BCEA, FICA, Companies Act…"
                rows={1}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  color: "var(--text)",
                  fontSize: 14,
                  outline: "none",
                  resize: "none",
                  lineHeight: 1.6,
                  maxHeight: 120,
                  padding: 0,
                  fontFamily: "inherit",
                }}
                onInput={(e) => {
                  const t = e.currentTarget;
                  t.style.height = "auto";
                  t.style.height = `${Math.min(t.scrollHeight, 120)}px`;
                }}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                style={{
                  background: input.trim() && !loading ? "var(--primary)" : "var(--border)",
                  border: "none",
                  borderRadius: 8,
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                  flexShrink: 0,
                  transition: "background 0.15s",
                }}
              >
                {loading
                  ? <Loader size={14} style={{ color: "white", animation: "spin 1s linear infinite" }} />
                  : <Send size={14} style={{ color: "white" }} />
                }
              </button>
            </div>
            <p style={{ color: "var(--text-dim)", fontSize: 11, textAlign: "center", margin: "10px 0 0", letterSpacing: "0.02em" }}>
              Every answer cited to source · Always verify with a qualified professional
            </p>
          </div>
        </main>
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1);   }
        }
      `}</style>
    </div>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { Send, Loader, BookOpen, ChevronDown } from "lucide-react";
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
  { value: "retail", label: "Retail & Labour" },
];

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
  const totalChunks = sources.reduce((a, s) => a + s.chunks, 0);

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ─────────────────────────────────────────────── */}
        <aside
          style={{
            width: 260,
            borderRight: "1px solid var(--border)",
            background: "var(--surface)",
            overflowY: "auto",
          }}
          className="hidden md:flex flex-col p-4 gap-4 shrink-0"
        >
          {/* Corpus stats */}
          <div>
            <p style={{ color: "var(--text-dim)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px" }}>
              Corpus
            </p>
            <div
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 10 }}
              className="p-3"
            >
              <div className="flex justify-between items-baseline">
                <span style={{ color: "var(--text)", fontSize: 20, fontWeight: 700 }}>
                  {totalChunks.toLocaleString()}
                </span>
                <span style={{ color: "var(--text-dim)", fontSize: 11 }}>chunks</span>
              </div>
              <div className="flex justify-between items-baseline mt-1">
                <span style={{ color: "var(--primary)", fontSize: 16, fontWeight: 600 }}>
                  {sources.length}
                </span>
                <span style={{ color: "var(--text-dim)", fontSize: 11 }}>sources</span>
              </div>
            </div>
          </div>

          {/* Sector filter */}
          <div>
            <p style={{ color: "var(--text-dim)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px" }}>
              Filter sector
            </p>
            <div className="flex flex-col gap-1">
              {SECTORS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSector(s.value)}
                  style={{
                    background: sector === s.value ? "var(--primary)20" : "transparent",
                    border: `1px solid ${sector === s.value ? "var(--primary)" : "transparent"}`,
                    borderRadius: 8,
                    color: sector === s.value ? "var(--primary)" : "var(--text-dim)",
                    padding: "6px 10px",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: 13,
                    transition: "all 0.1s",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Upload */}
          <div>
            <p style={{ color: "var(--text-dim)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px" }}>
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

          {/* Sources list */}
          {sources.length > 0 && (
            <div>
              <p style={{ color: "var(--text-dim)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px" }}>
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
                        background: "var(--surface-2)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        padding: "6px 8px",
                      }}
                    >
                      <p style={{ fontSize: 11, color: "var(--text)", margin: 0, fontWeight: 500 }} className="truncate">
                        {s.name}
                      </p>
                      <p style={{ fontSize: 10, color: "var(--text-dim)", margin: "1px 0 0" }}>
                        {s.chunks.toLocaleString()} chunks
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </aside>

        {/* ── Main chat area ─────────────────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-5">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-4">
                <div
                  style={{ background: "var(--primary)20", border: "1px solid var(--primary)40", borderRadius: 16 }}
                  className="p-4"
                >
                  <BookOpen size={28} style={{ color: "var(--primary)" }} />
                </div>
                <div>
                  <h1 style={{ color: "var(--text)", fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>
                    What do you need to know?
                  </h1>
                  <p style={{ color: "var(--text-dim)", fontSize: 14, margin: 0, maxWidth: 480 }}>
                    Ask anything about SA law or regulation in plain language. The answer surfaces with the exact source. As if you already knew it.
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full max-w-lg">
                  <p style={{ color: "var(--text-dim)", fontSize: 12, margin: "0 0 4px" }}>SA professionals often ask:</p>
                  {SUGGESTED.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      style={{
                        background: "var(--surface-2)",
                        border: "1px solid var(--border)",
                        borderRadius: 10,
                        color: "var(--text)",
                        padding: "10px 14px",
                        textAlign: "left",
                        cursor: "pointer",
                        fontSize: 13,
                        transition: "border-color 0.1s",
                      }}
                      className="hover:border-[var(--primary)]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <ChatMessage key={msg.id} msg={msg} />
            ))}

            {loading && (
              <div className="flex gap-3">
                <div
                  style={{ background: "var(--primary)30", border: "1px solid var(--primary)", borderRadius: 8 }}
                  className="w-8 h-8 flex items-center justify-center shrink-0 mt-0.5"
                >
                  <Loader size={14} style={{ color: "var(--primary)", animation: "spin 1s linear infinite" }} />
                </div>
                <div
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "4px 18px 18px 18px", padding: "10px 14px" }}
                >
                  <div className="flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: 6, height: 6, borderRadius: "50%", background: "var(--primary)",
                          animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── Input bar ─────────────────────────────────────────── */}
          <div
            style={{ borderTop: "1px solid var(--border)", background: "var(--surface)", padding: "12px 16px" }}
            className="shrink-0"
          >
            {/* Mobile sector + upload toggles */}
            <div className="flex gap-2 mb-2 md:hidden">
              <div className="relative">
                <button
                  onClick={() => setSectorOpen(!sectorOpen)}
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--text-dim)",
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
                  <div
                    style={{
                      position: "absolute",
                      bottom: "100%",
                      left: 0,
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      marginBottom: 4,
                      zIndex: 10,
                      minWidth: 150,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                    }}
                  >
                    {SECTORS.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => { setSector(s.value); setSectorOpen(false); }}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "8px 12px",
                          background: "transparent",
                          border: "none",
                          color: sector === s.value ? "var(--primary)" : "var(--text)",
                          fontSize: 13,
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowUpload(!showUpload)}
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  color: "var(--text-dim)",
                  fontSize: 12,
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                + Upload PDF
              </button>
            </div>

            {showUpload && (
              <div className="mb-2 md:hidden">
                <FileUpload onIngested={() => setShowUpload(false)} />
              </div>
            )}

            {/* Text input */}
            <div
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                display: "flex",
                alignItems: "flex-end",
                gap: 8,
                padding: "8px 8px 8px 14px",
                transition: "border-color 0.15s",
              }}
              className="focus-within:border-[var(--primary)]"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about POPIA, the NCA, BCEA, FICA…"
                rows={1}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  color: "var(--text)",
                  fontSize: 14,
                  outline: "none",
                  resize: "none",
                  lineHeight: 1.5,
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
                  borderRadius: 10,
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
                <Send size={15} style={{ color: "white" }} />
              </button>
            </div>
            <p style={{ color: "var(--text-dim)", fontSize: 11, textAlign: "center", margin: "8px 0 0" }}>
              Every answer cited to source · Always verify with a qualified professional
            </p>
          </div>
        </main>
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

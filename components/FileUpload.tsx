"use client";
import { useRef, useState } from "react";
import { Upload, X, CheckCircle, Loader } from "lucide-react";
import { ingestFile } from "@/lib/api";

interface Props {
  onIngested: (filename: string, chunks: number) => void;
}

export default function FileUpload({ onIngested }: Props) {
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setStatus("error");
      setMessage("Only PDF files are supported.");
      return;
    }
    setStatus("uploading");
    setMessage(`Uploading ${file.name}…`);
    try {
      const res = await ingestFile(file, "cross");
      setStatus("done");
      setMessage(`${file.name} — ${res.chunks} chunks ingested`);
      onIngested(file.name, res.chunks);
    } catch (err: unknown) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Upload failed.");
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className="w-full">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${dragging ? "var(--primary)" : "var(--border)"}`,
          borderRadius: 12,
          background: dragging ? "var(--primary)10" : "var(--surface-2)",
          transition: "all 0.15s",
          cursor: "pointer",
        }}
        className="flex flex-col items-center justify-center gap-2 py-6 px-4 text-center"
      >
        <Upload size={20} style={{ color: "var(--text-dim)" }} />
        <p style={{ color: "var(--text-dim)", fontSize: 13, margin: 0 }}>
          Drop a PDF here, or <span style={{ color: "var(--primary)" }}>browse</span>
        </p>
        <p style={{ color: "var(--text-dim)", fontSize: 11, margin: 0 }}>
          Ask questions about any SA regulatory document
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>

      {status !== "idle" && (
        <div
          style={{
            marginTop: 8,
            padding: "8px 12px",
            borderRadius: 8,
            background: status === "error" ? "#ef444420" : status === "done" ? "#22c55e20" : "var(--surface-2)",
            border: `1px solid ${status === "error" ? "#ef4444" : status === "done" ? "#22c55e" : "var(--border)"}`,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {status === "uploading" && <Loader size={14} style={{ color: "var(--primary)", animation: "spin 1s linear infinite" }} />}
          {status === "done" && <CheckCircle size={14} style={{ color: "#22c55e" }} />}
          {status === "error" && <X size={14} style={{ color: "#ef4444" }} />}
          <span style={{ fontSize: 12, color: status === "error" ? "#ef4444" : status === "done" ? "#22c55e" : "var(--text-dim)" }}>
            {message}
          </span>
          {status !== "uploading" && (
            <button
              onClick={() => { setStatus("idle"); setMessage(""); }}
              style={{ marginLeft: "auto", color: "var(--text-dim)", background: "none", border: "none", cursor: "pointer" }}
            >
              <X size={12} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

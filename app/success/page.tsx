"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState, Suspense } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { planLabel, planColor, type Plan } from "@/lib/trial";

const C = { bg: "#f9f8f5", surface: "#ffffff", border: "#e3e0da", primary: "#0c2340", primaryLt: "#0d9488", accent: "#0d9488", text: "#0d0d0d", muted: "#5f6368", dim: "#9aa0a6", success: "#16a34a" };

function SuccessContent() {
  const { user, isLoaded } = useUser();
  const [ready, setReady] = useState(false);

  // Poll Clerk metadata until plan is upgraded by webhook (max 8s)
  useEffect(() => {
    if (!isLoaded) return;
    let attempts = 0;
    const id = setInterval(async () => {
      await user?.reload();
      const plan = user?.publicMetadata?.plan as Plan;
      if (plan && plan !== "trial" && plan !== "expired") { setReady(true); clearInterval(id); }
      if (++attempts > 8) { setReady(true); clearInterval(id); }
    }, 1000);
    return () => clearInterval(id);
  }, [isLoaded, user]);

  const plan      = (user?.publicMetadata?.plan as Plan) ?? "trial";
  const isPaid    = plan !== "trial" && plan !== "expired";
  const label     = planLabel(plan);
  const color     = planColor(plan);
  const firstName = user?.firstName ?? "there";

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
      {!ready ? (
        <div>
          <div style={{ width: 56, height: 56, borderRadius: "50%", border: `3px solid ${C.primary}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} />
          <p style={{ color: C.muted, fontSize: 15 }}>Activating your plan...</p>
        </div>
      ) : (
        <div style={{ maxWidth: 520 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.success + "20", border: `2px solid ${C.success}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
            <CheckCircle size={28} style={{ color: C.success }} />
          </div>

          <div style={{ display: "inline-block", background: color + "20", border: `1px solid ${color}50`, color, borderRadius: 99, fontSize: 12, fontWeight: 700, padding: "4px 14px", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 20 }}>
            {label} active
          </div>

          <h1 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, letterSpacing: -1, color: C.text, margin: "0 0 16px", lineHeight: 1.15 }}>
            Welcome, {firstName}.
          </h1>
          <p style={{ fontSize: 16, color: C.muted, margin: "0 0 36px", lineHeight: 1.7 }}>
            {isPaid
              ? `Your ${label} plan is active. Every SA regulatory question you ask will be answered and cited to the exact source.`
              : "Your free trial is active. Ask anything about SA law or regulation and get cited answers instantly."}
          </p>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px", marginBottom: 32, textAlign: "left" }}>
            <p style={{ fontSize: 12, color: C.dim, margin: "0 0 12px", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>Your plan includes</p>
            {[
              isPaid && (plan === "pro" || plan === "team") ? "Unlimited queries" : isPaid ? "50 queries per day" : "10 queries per day",
              "Full SA regulatory corpus (30 sources)",
              "Every answer cited to the exact section",
              isPaid && (plan === "pro" || plan === "team") ? "Unlimited document uploads" : "Upload up to 10 documents",
            ].map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <CheckCircle size={13} style={{ color: color, flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: C.muted }}>{f}</span>
              </div>
            ))}
          </div>

          <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.primary, color: "white", textDecoration: "none", padding: "14px 32px", borderRadius: 12, fontWeight: 700, fontSize: 15 }}>
            Ask your first question <ArrowRight size={16} />
          </Link>
          {isPaid && (
            <p style={{ fontSize: 12, color: C.dim, marginTop: 14 }}>
              A receipt has been sent to {user?.primaryEmailAddress?.emailAddress}
            </p>
          )}
        </div>
      )}
      <style jsx global>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function SuccessPage() {
  return <Suspense><SuccessContent /></Suspense>;
}

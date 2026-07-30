"use client";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { CheckCircle, ArrowRight, Zap } from "lucide-react";
import { daysLeftInTrial, type Plan } from "@/lib/trial";

const C = {
  bg: "#f9f8f5", surface: "#ffffff", surface2: "#f1f0ed", border: "#e3e0da",
  primary: "#0c2340", primaryLt: "#0d9488", accent: "#0d9488",
  text: "#0d0d0d", muted: "#5f6368", dim: "#9aa0a6", success: "#16a34a",
};

const tiers = [
  {
    id: "starter",
    name: "Starter",
    price: "R750",
    per: "/month",
    desc: "For solo practitioners and small firms.",
    features: ["Full SA regulatory corpus", "50 queries per day", "Upload up to 10 documents", "Cited answers with source links", "Email support"],
    cta: "Start Starter plan",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "R2,500",
    per: "/month",
    desc: "For compliance teams and growing practices.",
    features: ["Everything in Starter", "Unlimited queries", "Unlimited document uploads", "Up to 5 users", "Audit logs and POPIA dashboard", "Priority support"],
    cta: "Start Pro plan",
    highlight: true,
  },
  {
    id: "team",
    name: "Team",
    price: "R8,000",
    per: "/month",
    desc: "For law firms, banks, and medical aids.",
    features: ["Everything in Pro", "Unlimited users", "SA data residency guarantee", "RBAC and SSO", "Custom document corpus", "Dedicated account manager"],
    cta: "Book a call",
    highlight: false,
    contact: true,
  },
];

export default function UpgradePage() {
  const { user } = useUser();
  const [notified, setNotified] = useState<string | null>(null);

  const currentPlan = (user?.publicMetadata?.plan as Plan) ?? "trial";
  const daysLeft    = user?.createdAt ? daysLeftInTrial(new Date(user.createdAt)) : 14;
  const email       = user?.primaryEmailAddress?.emailAddress ?? "";

  function handleSelect(tierId: string) {
    if (tierId === "team") {
      window.location.href = "mailto:contact@intuixion.ai?subject=Team plan enquiry";
      return;
    }
    setNotified(tierId);
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${C.border}`, background: C.surface, padding: "0 24px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <svg width="28" height="28" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="11" r="8" fill="#0c2340"/>
              <rect x="22" y="22" width="12" height="28" rx="6" fill="#0c2340"/>
              <line x1="33" y1="24" x2="50" y2="11" stroke="#0d9488" strokeWidth="5.5" strokeLinecap="round"/>
              <line x1="23" y1="28" x2="7" y2="44" stroke="#0d9488" strokeWidth="5.5" strokeLinecap="round"/>
            </svg>
            <span style={{ color: C.text, fontWeight: 700, fontSize: 15 }}>intuixion<span style={{ color: C.primary }}>.ai</span></span>
          </a>
          <a href="/demo" style={{ color: C.muted, fontSize: 13, textDecoration: "none" }}>Back to demo</a>
        </div>
      </nav>

      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "60px 24px" }}>
        {/* Trial status banner */}
        {currentPlan === "trial" && (
          <div style={{ background: "#f59e0b18", border: `1px solid #f59e0b40`, borderRadius: 12, padding: "14px 20px", marginBottom: 48, display: "flex", alignItems: "center", gap: 12 }}>
            <Zap size={16} style={{ color: "#f59e0b", flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: 14, color: "#f59e0b" }}>
              {daysLeft > 0
                ? `Your free trial has ${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining. Choose a plan to keep full access.`
                : "Your free trial has ended. Choose a plan to continue."}
            </p>
          </div>
        )}

        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 12, color: C.dim, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 12px" }}>Pricing</p>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, letterSpacing: -1, color: C.text, margin: "0 0 14px" }}>
            One saved hour per week pays for the plan.
          </h1>
          <p style={{ fontSize: 16, color: C.muted, margin: 0 }}>Paid plans are launching soon. Select a plan to register your interest and we will be in touch.</p>
        </div>

        {notified && (
          <div style={{ background: `${C.accent}15`, border: `1px solid ${C.accent}40`, borderRadius: 10, padding: "14px 20px", marginBottom: 24, fontSize: 14, color: C.accent, textAlign: "center" }}>
            Got it. We will reach out to {email || "your registered email"} shortly to complete your setup.
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="pricing-grid">
          {tiers.map((t) => (
            <div key={t.id} style={{ background: t.highlight ? `linear-gradient(160deg, ${C.primary}18, ${C.accent}0a)` : C.surface, border: `1px solid ${t.highlight ? C.primary + "60" : C.border}`, borderRadius: 18, padding: "32px 28px", position: "relative", boxShadow: t.highlight ? `0 0 60px ${C.primary}1a` : "none", transition: "transform 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 6px" }}>{t.name}</h2>
              <p style={{ fontSize: 13, color: C.muted, margin: "0 0 20px" }}>{t.desc}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: C.text, letterSpacing: -1 }}>{t.price}</span>
                <span style={{ fontSize: 14, color: C.muted }}>{t.per}</span>
              </div>
              <button
                onClick={() => handleSelect(t.id)}
                disabled={notified === t.id || currentPlan === t.id}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: currentPlan === t.id || notified === t.id ? C.border : t.highlight ? C.primary : "transparent", border: `1px solid ${currentPlan === t.id || notified === t.id ? C.border : t.highlight ? "transparent" : C.border}`, color: currentPlan === t.id || notified === t.id ? C.muted : t.highlight ? "white" : C.text, borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, marginBottom: 24, cursor: currentPlan === t.id || notified === t.id ? "default" : "pointer", transition: "opacity 0.15s" }}>
                {currentPlan === t.id ? "Current plan" : notified === t.id ? "Request noted" : t.cta}
                {currentPlan !== t.id && notified !== t.id && <ArrowRight size={14} />}
              </button>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {t.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <CheckCircle size={14} style={{ color: t.highlight ? C.accent : C.primary, marginTop: 1, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: C.dim, marginTop: 32 }}>
          All plans include a 14-day free trial. Cancel anytime from your account.
        </p>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) { .pricing-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

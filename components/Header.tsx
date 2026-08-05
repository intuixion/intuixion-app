"use client";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Zap } from "lucide-react";
import { daysLeftInTrial, planColor, planLabel, type Plan } from "@/lib/trial";

export default function Header() {
  const { user, isLoaded } = useUser();
  const plan = (user?.publicMetadata?.plan as Plan) ?? "trial";
  const org  = (user?.publicMetadata?.org as string) ?? "";

  // Env-var override: set NEXT_PUBLIC_PILOT_ORG in .env.local (or Vercel env) to
  // activate pilot UI for client demos without touching Clerk metadata.
  const pilotOrgEnv   = process.env.NEXT_PUBLIC_PILOT_ORG  ?? "";
  const pilotSeatsEnv = process.env.NEXT_PUBLIC_PILOT_SEATS ?? "";
  const pilotRoleEnv  = process.env.NEXT_PUBLIC_PILOT_ROLE  ?? "Admin";

  const effectivePlan: Plan = pilotOrgEnv ? "pilot" : plan;
  const effectiveOrg        = pilotOrgEnv || org;

  const daysLeft  = user?.createdAt ? daysLeftInTrial(new Date(user.createdAt)) : 14;
  const showAlert = effectivePlan === "trial" && daysLeft <= 3;
  const color     = planColor(effectivePlan);
  const isPilot   = effectivePlan === "pilot";
  const isTrial   = effectivePlan === "trial" || effectivePlan === "expired";

  return (
    <header style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)", height: 52, position: "relative" }} className="flex items-center justify-between px-6 shrink-0">
      <Link href="/" className="flex items-center gap-2 no-underline">
        <div style={{ borderRadius: 8, overflow: "hidden", flexShrink: 0 }} className="w-7 h-7">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" width="28" height="28">
            <rect width="56" height="56" rx="12" fill="#0c2340"/>
            <line x1="33" y1="24" x2="50" y2="11" stroke="#2dd4bf" strokeWidth="5.5" strokeLinecap="round"/>
            <line x1="23" y1="28" x2="7"  y2="44" stroke="#2dd4bf" strokeWidth="5.5" strokeLinecap="round"/>
            <circle cx="28" cy="11" r="8" fill="#ffffff"/>
            <rect x="22" y="22" width="12" height="28" rx="6" fill="#ffffff"/>
          </svg>
        </div>
        <span style={{ color: "var(--text)", fontFamily: "Georgia, serif", fontWeight: "normal", fontSize: 15, letterSpacing: "-0.3px" }}>
          intuix<span style={{ color: "#2dd4bf" }}>ion</span>.ai
        </span>
      </Link>

      {/* Centre — POPIA trust badge */}
      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 6, background: "#0d948812", border: "1px solid #0d948830", borderRadius: 99, padding: "3px 12px 3px 8px" }}>
        <span style={{ fontSize: 13, lineHeight: 1 }}>🇿🇦</span>
        <span style={{ fontSize: 11, fontWeight: 500, color: "#0d9488", letterSpacing: "0.02em" }}>
          Hosted in South Africa · POPIA-compliant
        </span>
      </div>

      <div className="flex items-center gap-3">
        {isLoaded && user && (
          <>
            {isPilot ? (
              /* Pilot account — org + role + seats, no trial pressure */
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ background: "#0c234015", color: "#0c2340", border: "1px solid #0c234030", borderRadius: 99, fontSize: 11, fontWeight: 600, padding: "3px 10px", letterSpacing: 0.3 }}>
                  Pilot{effectiveOrg ? ` · ${effectiveOrg}` : ""}
                </span>
                {(pilotSeatsEnv || pilotRoleEnv) && (
                  <span style={{ color: "var(--muted)", fontSize: 11 }}>
                    {pilotRoleEnv}{pilotSeatsEnv ? ` · ${pilotSeatsEnv} seats` : ""}
                  </span>
                )}
              </div>
            ) : (
              /* Trial / paid plan pill */
              <span style={{ background: color + "18", color, border: `1px solid ${color}35`, borderRadius: 99, fontSize: 11, fontWeight: 600, padding: "3px 10px", letterSpacing: 0.3 }}>
                {effectivePlan === "trial" ? `Trial · ${daysLeft}d left` : effectivePlan === "expired" ? "Expired" : planLabel(effectivePlan)}
              </span>
            )}

            {/* CTA */}
            {isPilot ? (
              <a href="mailto:contact@intuixion.ai" style={{ background: "var(--primary)", color: "white", borderRadius: 8, fontSize: 12, fontWeight: 600, padding: "5px 12px", textDecoration: "none", display: "flex", alignItems: "center", gap: 5, transition: "opacity 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
                Talk to us
              </a>
            ) : isTrial ? (
              <Link href="/upgrade" style={{ background: showAlert ? "#f59e0b" : "var(--primary)", color: "white", borderRadius: 8, fontSize: 12, fontWeight: 600, padding: "5px 12px", textDecoration: "none", display: "flex", alignItems: "center", gap: 5, transition: "opacity 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
                {showAlert && <Zap size={11} />}
                Upgrade
              </Link>
            ) : null}
          </>
        )}

        {isLoaded && <UserButton />}
      </div>
    </header>
  );
}

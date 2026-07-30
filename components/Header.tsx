"use client";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Zap } from "lucide-react";
import { daysLeftInTrial, planLabel, planColor, type Plan } from "@/lib/trial";

export default function Header() {
  const { user, isLoaded } = useUser();
  const plan      = (user?.publicMetadata?.plan as Plan) ?? "trial";
  const daysLeft  = user?.createdAt ? daysLeftInTrial(new Date(user.createdAt)) : 14;
  const showAlert = plan === "trial" && daysLeft <= 3;
  const color     = planColor(plan);
  const label     = planLabel(plan);

  return (
    <header style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }} className="flex items-center justify-between px-6 py-3 shrink-0">
      <Link href="/" className="flex items-center gap-2 no-underline">
        <div style={{ background: "linear-gradient(135deg, #6d5fff, #00d4a8)", borderRadius: 8 }} className="w-7 h-7 flex items-center justify-center text-white font-bold text-sm">
          i
        </div>
        <span style={{ color: "var(--text)" }} className="font-semibold text-sm tracking-wide">
          intuixion<span style={{ color: "var(--primary)" }}>.ai</span>
        </span>
      </Link>

      <div className="flex items-center gap-3">
        {/* Trial / plan pill */}
        {isLoaded && user && (
          <span style={{ background: color + "20", color, border: `1px solid ${color}40`, borderRadius: 99, fontSize: 11, fontWeight: 600, padding: "3px 10px", letterSpacing: 0.3 }}>
            {plan === "trial" ? `Trial: ${daysLeft}d left` : label}
          </span>
        )}

        {/* Upgrade CTA — shown on trial or expired */}
        {isLoaded && user && (plan === "trial" || plan === "expired") && (
          <Link href="/upgrade" style={{ background: showAlert ? "#f59e0b" : "var(--primary)", color: "white", borderRadius: 8, fontSize: 12, fontWeight: 600, padding: "5px 12px", textDecoration: "none", display: "flex", alignItems: "center", gap: 5, transition: "opacity 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
            {showAlert && <Zap size={11} />}
            Upgrade
          </Link>
        )}

        {/* Clerk user button — handles sign-out, profile, etc. */}
        {isLoaded && <UserButton />}
      </div>
    </header>
  );
}

"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight, ArrowDown, CheckCircle, FileText,
  Scale, Heart, Building2, Briefcase, Menu, X,
  RefreshCw, Plus, Minus,
  Gavel, UserCheck, ClipboardList,
} from "lucide-react";

const C = {
  bg:        "#f9f8f5",
  surface:   "#ffffff",
  surface2:  "#f1f0ed",
  border:    "#e3e0da",
  primary:   "#0c2340",
  primaryLt: "#0d9488",
  accent:    "#0d9488",
  text:      "#0d0d0d",
  muted:     "#5f6368",
  dim:       "#9aa0a6",
  success:   "#16a34a",
};

function Pill({ children, color = C.primary }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ background: color + "20", color, border: `1px solid ${color}40`, borderRadius: 6, fontSize: 11, fontWeight: 600, padding: "2px 8px", letterSpacing: 0.5, textTransform: "uppercase" as const }}>
      {children}
    </span>
  );
}
function SectionHeading({ pill, pillColor, pillText, h2, sub }: { pill?: boolean; pillColor?: string; pillText?: string; h2: string; sub?: string }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 64 }}>
      {pill && <Pill color={pillColor}>{pillText}</Pill>}
      <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: -1, color: C.text, margin: "16px 0 16px", lineHeight: 1.15 }}>
        {h2}
      </h2>
      {sub && <p style={{ fontSize: 17, color: C.muted, maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>{sub}</p>}
    </div>
  );
}
function InlineCTA({ label = "Start a pilot", href = "mailto:contact@intuixion.ai?subject=Start%20a%20pilot" }: { label?: string; href?: string }) {
  return (
    <div style={{ textAlign: "center", marginTop: 48 }}>
      <a href={href} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.primary, color: "white", textDecoration: "none", padding: "12px 28px", borderRadius: 10, fontWeight: 600, fontSize: 14, transition: "opacity 0.15s" }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
        {label} <ArrowRight size={14} />
      </a>
    </div>
  );
}

// ─── Logo mark ────────────────────────────────────────────────────────────────
function LogoMark({ size = 30, onDark = false }: { size?: number; onDark?: boolean }) {
  const fill = onDark ? "#ffffff" : C.primary;
  const arm  = onDark ? "#2dd4bf" : C.accent;
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="11" r="8" fill={fill} />
      <rect x="22" y="22" width="12" height="28" rx="6" fill={fill} />
      <line x1="33" y1="24" x2="50" y2="11" stroke={arm} strokeWidth="5.5" strokeLinecap="round" />
      <line x1="23" y1="28" x2="7"  y2="44" stroke={arm} strokeWidth="5.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Demo mockup ──────────────────────────────────────────────────────────────
function DemoMockup() {
  const answerText = "Under Section 11 of POPIA, personal information may only be processed if at least one condition is met: (a) the data subject consents; (b) processing is necessary to carry out a contract; (c) processing complies with a legal obligation; or (d) processing protects a legitimate interest of the data subject.";
  const [visible, setVisible] = useState(0);
  const [playing, setPlaying] = useState(false);

  function play() { setVisible(0); setPlaying(true); }
  useEffect(() => { play(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      const id = setInterval(() => {
        setVisible((v) => { if (v >= answerText.length) { clearInterval(id); setPlaying(false); return v; } return v + 3; });
      }, 16);
      return () => clearInterval(id);
    }, 700);
    return () => clearTimeout(t);
  }, [playing, answerText.length]);

  const done = visible >= answerText.length;

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.10)", maxWidth: 560, width: "100%" }}>
      <div style={{ background: C.surface2, borderBottom: `1px solid ${C.border}`, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <LogoMark size={16} />
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text, letterSpacing: -0.3 }}>intuixion<span style={{ color: C.primary }}>.ai</span></span>
        </span>
        {done && (
          <button onClick={play} style={{ display: "flex", alignItems: "center", gap: 5, background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, padding: "3px 10px", fontSize: 11, cursor: "pointer", fontWeight: 500 }}>
            <RefreshCw size={10} /> Replay
          </button>
        )}
      </div>
      <div style={{ padding: "20px 20px 8px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <div style={{ background: C.primary, color: "white", borderRadius: "16px 16px 4px 16px", padding: "10px 14px", fontSize: 13, maxWidth: "80%", lineHeight: 1.5 }}>
            What are the conditions for lawful processing under POPIA?
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: C.primary, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LogoMark size={18} onDark />
          </div>
          <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: "4px 16px 16px 16px", padding: "10px 14px", fontSize: 13, lineHeight: 1.7, color: C.text, flex: 1, minHeight: 80 }}>
            {answerText.slice(0, visible)}
            {!done && <span style={{ display: "inline-block", width: 2, height: 14, background: C.primary, marginLeft: 1, animation: "blink 0.7s step-end infinite", verticalAlign: "middle" }} />}
          </div>
        </div>
        {done && (
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", marginBottom: 16, background: C.bg, display: "flex", alignItems: "center", gap: 10, animation: "fadeIn 0.4s ease" }}>
            <FileText size={14} style={{ color: C.dim, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 12, color: C.text, fontWeight: 500 }}>Protection of Personal Information Act (POPIA)</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: C.dim }}>Section 11 · passage 42 of 197</p>
            </div>
            <div style={{ background: C.success + "20", color: C.success, borderRadius: 6, fontSize: 11, fontWeight: 700, padding: "2px 8px" }}>94%</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Product",      href: "#features" },
    { label: "How it works", href: "#how"      },
    { label: "Coverage",     href: "#coverage" },
    { label: "Pricing",      href: "#pricing"  },
  ];

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent", background: scrolled ? C.surface + "ee" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", transition: "all 0.3s" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", height: 64, gap: 32 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <LogoMark size={30} />
            <span style={{ color: C.text, fontWeight: 700, fontSize: 16, letterSpacing: -0.3 }}>intuixion<span style={{ color: C.primary }}>.ai</span></span>
          </Link>
          <div style={{ display: "flex", gap: 4, flex: 1 }} className="hidden-mobile">
            {links.map((l) => (
              <a key={l.href} href={l.href} style={{ color: C.muted, fontSize: 14, fontWeight: 500, padding: "6px 12px", borderRadius: 8, textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}>
                {l.label}
              </a>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
            <Link href="/sign-in" className="hidden-mobile" style={{ color: C.muted, fontSize: 14, fontWeight: 500, padding: "8px 14px", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}>
              Sign in
            </Link>
            <a href="mailto:contact@intuixion.ai?subject=Start%20a%20pilot" style={{ background: C.primary, color: "white", fontSize: 14, fontWeight: 600, padding: "9px 18px", borderRadius: 10, textDecoration: "none", transition: "opacity 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
              Start a pilot
            </a>
            <button onClick={() => setOpen(!open)} className="show-mobile" style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", padding: 4 }}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {open && (
          <div style={{ borderTop: `1px solid ${C.border}`, padding: "16px 0", display: "flex", flexDirection: "column", gap: 4 }}>
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ color: C.text, fontSize: 15, padding: "10px 0", textDecoration: "none", borderBottom: `1px solid ${C.border}` }}>{l.label}</a>
            ))}
            <a href="mailto:contact@intuixion.ai?subject=Start%20a%20pilot" style={{ background: C.primary, color: "white", textDecoration: "none", padding: "12px 0", textAlign: "center", borderRadius: 10, marginTop: 8, fontWeight: 600 }}>Start a pilot</a>
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ position: "relative", overflow: "hidden", padding: "148px 24px 100px", textAlign: "center" }}>
      <div aria-hidden={true} style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(#0c234011 1px, transparent 1px)", backgroundSize: "24px 24px", WebkitMaskImage: "radial-gradient(ellipse 72% 72% at 50% 38%, transparent 0%, black 100%)", maskImage: "radial-gradient(ellipse 72% 72% at 50% 38%, transparent 0%, black 100%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", maxWidth: 840, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 800, letterSpacing: -2, lineHeight: 1.08, margin: "0 0 24px", color: C.text, fontFamily: "Georgia, 'Times New Roman', serif" }}>
          The answer is in the Act.
        </h1>

        <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: C.muted, maxWidth: 560, margin: "0 auto 44px", lineHeight: 1.7 }}>
          Ask any question about SA law, compliance, or regulation. Get the cited answer, exact Act and section, in under 3 seconds.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
          <a href="mailto:contact@intuixion.ai?subject=Start%20a%20pilot" style={{ background: C.primary, color: "white", textDecoration: "none", padding: "15px 32px", borderRadius: 12, fontWeight: 700, fontSize: 15, display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 2px 12px rgba(12,35,64,0.18)", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(12,35,64,0.28)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(12,35,64,0.18)"; }}>
            Start a pilot <ArrowRight size={16} />
          </a>
          <a href="#how" style={{ color: C.muted, textDecoration: "none", fontSize: 15, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6, transition: "color 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}>
            See how it works <ArrowDown size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Product demo ─────────────────────────────────────────────────────────────
function ProductDemo() {
  return (
    <section style={{ background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "56px 24px 72px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: C.dim, letterSpacing: 1.4, textTransform: "uppercase", fontWeight: 600, marginBottom: 32 }}>
          See it in action
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <DemoMockup />
        </div>
      </div>
    </section>
  );
}

// ─── Founder note — deliberately different layout, no grid, no cards ──────────
function FounderNote() {
  return (
    <section style={{
      borderTop: `1px solid ${C.border}`,
      borderBottom: `1px solid ${C.border}`,
      background: C.surface2,
      padding: "64px 24px",
    }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <p style={{ fontSize: 11, color: C.dim, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 28px", fontWeight: 600 }}>
          Why I built this
        </p>
        <blockquote style={{
          fontSize: "clamp(18px, 2.5vw, 26px)",
          fontWeight: 500,
          color: C.text,
          lineHeight: 1.65,
          margin: "0 0 36px",
          borderLeft: `3px solid ${C.primary}`,
          paddingLeft: 28,
          fontStyle: "normal",
        }}>
          World-class AI tools have been built for other markets.
          SA professionals navigate regulation just as complex as any in London or New York.
          They have done it without the tools to match.
          That is the gap I came here to close. Starting in SA, building for Africa.
        </blockquote>
        <div style={{ display: "flex", alignItems: "center", gap: 14, paddingLeft: 28 }}>
          <div style={{
            width: 42, height: 42, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.primary}40, ${C.accent}30)`,
            border: `1px solid ${C.primary}50`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 700, color: C.primaryLt, flexShrink: 0,
          }}>
            MK
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text }}>Malipalema Khang</p>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: C.muted }}>Founder, intuixion.ai · Cape Town</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { value: "3 to 5 hours",    head: "saved per week",    sub: "per legal or compliance professional"       },
    { value: "Under 3 seconds", head: "to a cited answer", sub: "from plain-language question to exact source" },
    { value: "30",        head: "SA regulatory sources",   sub: "re-ingested and refreshed every month"      },
    { value: "18,125",    head: "searchable passages",     sub: "indexed and retrievable in plain language"  },
  ];
  return (
    <section style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.surface }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }} className="stats-grid">
          {stats.map((s, i) => (
            <div key={s.head} style={{ padding: "36px 24px", textAlign: "center", borderRight: i < stats.length - 1 ? `1px solid ${C.border}` : "none" }} className="stat-item">
              <div style={{ width: 28, height: 2, background: C.accent, margin: "0 auto 14px", borderRadius: 1 }} />
              <p style={{ fontSize: 28, fontWeight: 800, color: C.text, margin: "0 0 6px", letterSpacing: -1, lineHeight: 1.1 }}>{s.value}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: "0 0 5px", letterSpacing: -0.2 }}>{s.head}</p>
              <p style={{ fontSize: 12, color: C.dim, margin: 0, lineHeight: 1.45 }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Who it's for ─────────────────────────────────────────────────────────────
function WhoItsFor() {
  const personas = [
    {
      icon: <Gavel size={22} />,
      color: C.primary,
      role: "The Attorney",
      tagline: "Research that used to take an associate half a day.",
      desc: "Ask about any Act, get the relevant sections with exact wording and citation. Check jurisdiction, verify a section number before a client call, or brief a junior on their rights. In the time it takes to make coffee.",
      examples: [
        "What is reckless lending under the NCA?",
        "Does POPIA allow cross-border data transfers?",
        "What are a director's duties under the Companies Act?",
      ],
    },
    {
      icon: <UserCheck size={22} />,
      color: C.accent,
      role: "The Compliance Officer",
      tagline: "Regulatory queries pile up. Now they clear in minutes.",
      desc: "Instant answers on FICA obligations, POPIA processing conditions, FSCA requirements, and SARB directives, with the exact section number your audit report requires. No more searching through 400-page Acts by hand.",
      examples: [
        "What are FICA's customer due diligence requirements?",
        "What do FSCA TCF obligations require?",
        "What capital adequacy ratios does SARB require?",
      ],
    },
    {
      icon: <ClipboardList size={22} />,
      color: C.primaryLt,
      role: "The HR Director",
      tagline: "BCEA, LRA, EEA questions arrive daily. Answer them fast.",
      desc: "Dismissal procedures, minimum wage thresholds, equity reporting obligations, B-BBEE scorecards. Your team gets accurate, cited answers without escalating every query to the legal department.",
      examples: [
        "What is the maximum working week under the BCEA?",
        "What constitutes automatically unfair dismissal under the LRA?",
        "Who qualifies as a designated employer under the EEA?",
      ],
    },
  ];

  return (
    <section style={{ padding: "80px 24px", background: C.surface }}>
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <SectionHeading
          pill pillText="Who uses intuixion"
          h2="Built for the SA professionals who live inside regulation."
          sub="Whether you are in a law firm, a bank's compliance department, or an HR team, your questions are different. The answer format is the same: precise, sourced, instant."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48 }} className="feature-grid">
          {personas.map((p) => (
            <div key={p.role}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, margin: "0 0 6px" }}>{p.role}</h3>
              <p style={{ fontSize: 13, color: C.primary, margin: "0 0 16px", fontWeight: 500 }}>{p.tagline}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {p.examples.map((ex) => (
                  <div key={ex} style={{ display: "flex", gap: 10 }}>
                    <span style={{ color: C.primary, flexShrink: 0, fontSize: 14, lineHeight: 1.5 }}>—</span>
                    <span style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{ex}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Problem ──────────────────────────────────────────────────────────────────
function Problem() {
  const pains = [
    {
      stat: "3–5 hrs",
      statLabel: "lost per professional, per week",
      title: "Manual searches eat the working day",
      desc: "Attorneys, compliance officers, and HR directors routinely spend half an afternoon tracking down a single regulatory answer. The section exists. The Act is public. The time it takes to find the exact wording — and verify it has not been amended — is the real cost.",
    },
    {
      stat: "30+",
      statLabel: "Acts amended in the last 3 years",
      title: "References go stale without warning",
      desc: "Citing a superseded section of the NCA, an outdated CMS Circular, or an old FSCA notice is not a minor error. It is a compliance risk. Keeping up means re-reading source documents after every Gazette update, indefinitely.",
    },
    {
      stat: "R400–R800",
      statLabel: "per billable hour spent on routine lookups",
      title: "Skilled time on low-value work",
      desc: "Every statutory lookup that takes 45 minutes costs your practice or employer real money. Multiply it across a team, across every query, every week. The total is not a rounding error — it is a structural cost built into how SA professionals work.",
    },
  ];

  return (
    <section style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <SectionHeading pill pillColor={C.accent} pillText="The problem" h2="SA professionals spend hours on questions that should take seconds." sub="The information exists. It is buried in PDFs, Gazettes, and amending Acts. Finding it precisely, with the right citation, is the bottleneck." />
        <div style={{ display: "flex", flexDirection: "column" }}>
          {pains.map((p, i) => (
            <div key={p.stat} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 48, padding: "44px 0", borderBottom: i < pains.length - 1 ? `1px solid ${C.border}` : "none", alignItems: "flex-start" }} className="problem-row">
              <div style={{ flexShrink: 0 }}>
                <div style={{ fontSize: 38, fontWeight: 800, color: C.text, letterSpacing: -1.5, lineHeight: 1 }}>{p.stat}</div>
                <div style={{ fontSize: 12, color: C.dim, marginTop: 6, lineHeight: 1.4 }}>{p.statLabel}</div>
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 10px" }}>{p.title}</h3>
                <p style={{ fontSize: 15, color: C.muted, margin: 0, lineHeight: 1.75 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────
const QUESTION = "What are POPIA’s conditions for cross-border data transfers?";

function MockChrome() {
  return (
    <div style={{ background: C.surface2, borderBottom: `1px solid ${C.border}`, padding: "9px 14px", display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f87171" }} />
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fbbf24" }} />
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80" }} />
      <span style={{ display: "flex", alignItems: "center", gap: 5, marginLeft: 8 }}>
        <LogoMark size={13} />
        <span style={{ fontSize: 11, color: C.dim, fontWeight: 600 }}>intuixion<span style={{ color: C.primary }}>.ai</span></span>
      </span>
    </div>
  );
}
function MockUserBubble() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
      <div style={{ background: C.primary, color: "white", borderRadius: "12px 12px 3px 12px", padding: "8px 12px", fontSize: 12, maxWidth: "80%", lineHeight: 1.5 }}>{QUESTION}</div>
    </div>
  );
}
function MockAvatar() {
  return (
    <div style={{ width: 24, height: 24, borderRadius: 7, background: C.primary, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <LogoMark size={14} onDark />
    </div>
  );
}
function StepAsk() {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 14px rgba(0,0,0,0.07)" }}>
      <MockChrome />
      <div style={{ padding: "18px 16px 20px" }}>
        <p style={{ margin: "0 0 10px", fontSize: 11, color: C.dim, letterSpacing: 0.4 }}>Ask anything about SA law or regulation</p>
        <div style={{ background: C.bg, border: `1.5px solid ${C.primary}`, borderRadius: 10, padding: "10px 10px 10px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
          <p style={{ flex: 1, margin: 0, fontSize: 13, color: C.text, lineHeight: 1.55 }}>
            {QUESTION}<span style={{ display: "inline-block", width: 2, height: 14, background: C.primary, marginLeft: 2, verticalAlign: "middle" }} />
          </p>
          <div style={{ background: C.primary, borderRadius: 8, padding: "6px 11px", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
            <span style={{ fontSize: 11, color: "white", fontWeight: 600 }}>Ask</span>
            <ArrowRight size={11} color="white" />
          </div>
        </div>
      </div>
    </div>
  );
}
function StepSearch() {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 14px rgba(0,0,0,0.07)" }}>
      <MockChrome />
      <div style={{ padding: "14px 16px" }}>
        <MockUserBubble />
        <div style={{ display: "flex", gap: 8 }}>
          <MockAvatar />
          <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: "3px 12px 12px 12px", padding: "10px 12px", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
              <span style={{ fontSize: 12, color: C.muted }}>Searching 18,125 passages...</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 5 }}>
              {["POPIA", "PAIA", "ECTA", "NCA"].map((s) => (
                <span key={s} style={{ background: C.accent + "18", color: C.accent, fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, letterSpacing: 0.2 }}>{s}</span>
              ))}
              <span style={{ color: C.dim, fontSize: 10, padding: "2px 0", alignSelf: "center" }}>+26 more</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function StepCited() {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 14px rgba(0,0,0,0.07)" }}>
      <MockChrome />
      <div style={{ padding: "14px 16px" }}>
        <MockUserBubble />
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <MockAvatar />
          <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: "3px 12px 12px 12px", padding: "10px 12px", fontSize: 12, flex: 1, lineHeight: 1.65, color: C.text }}>
            Under Section 72 of POPIA, personal information may only be transferred to a foreign country if adequate protection is in place or the data subject consents.
          </div>
        </div>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", background: C.bg, display: "flex", alignItems: "center", gap: 8 }}>
          <FileText size={12} style={{ color: C.dim, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 11, color: C.text, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>Protection of Personal Information Act</p>
            <p style={{ margin: "1px 0 0", fontSize: 10, color: C.dim }}>Section 72 · passage 108 of 197</p>
          </div>
          <div style={{ background: C.success + "20", color: C.success, borderRadius: 5, fontSize: 10, fontWeight: 700, padding: "2px 7px", flexShrink: 0 }}>91%</div>
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Ask the way you think it",   desc: "Type your question as you would say it to a colleague. No Boolean operators, no Gazette numbers, no legal shorthand required.", panel: <StepAsk />   },
    { n: "02", title: "The answer finds you",        desc: "Hybrid keyword and semantic retrieval searches 18,125 passages simultaneously. You do not navigate to the answer. It surfaces.", panel: <StepSearch /> },
    { n: "03", title: "Verified. Cited. Confident.", desc: "The answer arrives with the exact source: document, section, and relevance score. One click to confirm. The research is done properly.", panel: <StepCited />  },
  ];
  return (
    <section id="how" style={{ padding: "80px 24px", background: C.surface }}>
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <SectionHeading pill pillText="How it works" h2="From question to cited answer in 3 steps." />
        <div style={{ display: "flex", flexDirection: "column" }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ padding: "36px 0", borderBottom: i < steps.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ display: "grid", gridTemplateColumns: "72px 1fr 1fr", gap: 32, alignItems: "center" }} className="how-row-inner">
                <div style={{ fontSize: 38, fontWeight: 900, color: C.border, letterSpacing: -2 }}>{s.n}</div>
                <div>
                  <h3 style={{ fontSize: 19, fontWeight: 700, color: C.text, margin: "0 0 10px" }}>{s.title}</h3>
                  <p style={{ fontSize: 15, color: C.muted, margin: 0, lineHeight: 1.7 }}>{s.desc}</p>
                </div>
                <div className="how-example">{s.panel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    { title: "Plain-language search",    desc: "Ask the way you would say it to a colleague. No Boolean operators, no Gazette numbers, no legal shorthand required." },
    { title: "Every answer cited",       desc: "Every response references the exact source document, section, and relevance score. Verify in one click." },
    { title: "Upload your documents",    desc: "Ingest internal policies, contracts, or client agreements alongside the public regulatory corpus." },
    { title: "POPIA-compliant",          desc: "SA data residency available on Team. No client data leaves South Africa without explicit consent." },
    { title: "Multi-user teams",         desc: "Role-based access control, audit logs, and full query history. Each organisation's documents are completely isolated." },
    { title: "Refreshed monthly",        desc: "The full corpus re-ingests every month. When an Act is amended or a Circular is published, your answers update automatically." },
  ];

  return (
    <section id="features" style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <SectionHeading pill pillText="Capabilities" h2="Built for professionals who cannot afford to be wrong." sub="Every feature is designed around one requirement: accuracy. Speed follows." />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 80px" }} className="features-list">
          {features.map((f) => (
            <div key={f.title} style={{ padding: "24px 0", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 20 }}>
              <div style={{ width: 20, flexShrink: 0, paddingTop: 4 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.primary }} />
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: "0 0 6px" }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: C.muted, margin: 0, lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <InlineCTA label="Start a pilot" />
      </div>
    </section>
  );
}

// ─── Corpus ───────────────────────────────────────────────────────────────────
function Corpus() {
  const sectors = [
    {
      icon: <Scale size={18} />, label: "Cross-sector", color: C.accent,
      tagline: "Data rights, employment, consumer protection, tax",
      docs: ["POPIA Act 4 of 2013", "Companies Act 71 of 2008", "Labour Relations Act", "BCEA", "Consumer Protection Act", "SARS Tax Guides"],
    },
    {
      icon: <Heart size={18} />, label: "Healthcare", color: "#f472b6",
      tagline: "Medical aid benefits, treatment protocols, NHI",
      docs: ["Medical Schemes Act", "National Health Act", "EML and STGs (DoH)", "CMS Circulars", "ICD-10 SA Edition", "Discovery Annual Report"],
    },
    {
      icon: <Building2 size={18} />, label: "Financial Services", color: C.primary,
      tagline: "AML, credit regulation, banking standards, market conduct",
      docs: ["National Credit Act", "FICA", "SARB Prudential Standards", "FSCA Regulations", "JSE Listings Requirements", "FSRA (Twin Peaks)"],
    },
    {
      icon: <Briefcase size={18} />, label: "Retail and Labour", color: C.primaryLt,
      tagline: "Minimum wages, transformation, NCR guidelines",
      docs: ["Employment Equity Act", "B-BBEE Codes", "NCR Guidelines", "Pension Funds Act", "SAIA Guidelines", "Wage Determinations"],
    },
  ];

  return (
    <section id="coverage" style={{ padding: "80px 24px", background: C.surface }}>
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <SectionHeading pill pillColor={C.accent} pillText="The corpus" h2="30 SA regulatory sources, refreshed monthly." sub="We re-ingest the full corpus every month. When the NCA is amended or a new CMS Circular is published, your answers update automatically. This includes the promulgated FSRA, not the draft." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="corpus-grid">
          {sectors.map((s) => (
            <div key={s.label} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ color: C.muted }}>{s.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{s.label}</span>
                </div>
                <p style={{ fontSize: 11, color: C.muted, margin: 0, lineHeight: 1.4 }}>{s.tagline}</p>
              </div>
              <div style={{ padding: "12px 16px" }}>
                {s.docs.map((d) => (
                  <div key={d} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: `1px solid ${C.border}20` }}>
                    <CheckCircle size={11} style={{ color: C.primary, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: C.muted }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: C.dim, marginTop: 20 }}>
          Last updated 18 May 2026. International treaties and SADC regulation are not yet covered.
        </p>
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <a href="mailto:contact@intuixion.ai?subject=Start%20a%20pilot" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: C.primary, fontWeight: 600, fontSize: 14, textDecoration: "none", borderBottom: `1px solid ${C.primary}40`, paddingBottom: 2 }}>
            Start a pilot — full corpus access included <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing teaser ───────────────────────────────────────────────────────────
function Pricing() {
  return (
    <section id="pricing" style={{ padding: "80px 24px", background: C.surface }}>
      <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: C.dim, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 20px", fontWeight: 600 }}>Pricing</p>
        <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 800, letterSpacing: -1, color: C.text, margin: "0 0 16px", lineHeight: 1.15 }}>
          One saved hour per week pays for the plan.
        </h2>
        <p style={{ fontSize: 17, color: C.muted, margin: "0 0 12px", lineHeight: 1.7 }}>
          Priced for firms of all sizes — from solo practitioners to large compliance teams.
        </p>
        <p style={{ fontSize: 14, color: C.dim, margin: "0 0 36px" }}>Every pilot includes full corpus access, onboarding, and a dedicated setup session.</p>
        <a href="mailto:contact@intuixion.ai?subject=Start%20a%20pilot" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: C.primary, textDecoration: "none", fontSize: 15, fontWeight: 600, borderBottom: `1px solid ${C.primary}40`, paddingBottom: 2, transition: "border-color 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = C.primary)}
          onMouseLeave={(e) => (e.currentTarget.style.borderBottomColor = C.primary + "40")}>
          Book a pilot call <ArrowRight size={15} />
        </a>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    {
      q: "Is the information legally accurate? Can I rely on it?",
      a: "intuixion retrieves and cites text directly from the source Acts and Regulations. It does not paraphrase or infer. Every answer references the exact section so you can verify it yourself. It is a research tool, not legal advice. Always confirm material matters with a qualified legal or compliance professional before acting.",
    },
    {
      q: "What happens when a regulation is amended?",
      a: "The corpus is refreshed monthly. When SARS publishes an updated guide, or the CMS releases a new Circular, those documents are re-ingested in the next refresh cycle. For urgent regulatory changes, verify directly against the official Gazette or source before relying on an answer.",
    },
    {
      q: "Does this replace a lawyer or compliance officer?",
      a: "No. It replaces the research phase: finding the right section, understanding what it says, identifying which Act governs a scenario. Judgment, advice, and accountability remain with the professional. Most users describe it as giving their team back 3 to 5 hours per week.",
    },
    {
      q: "Where is my data stored? Is it POPIA-compliant?",
      a: "Starter and Pro plans process data on EU-based servers. Team plans include SA data residency on Cape Town infrastructure, keeping all data within South African borders. All plans use encryption in transit and at rest.",
    },
    {
      q: "How quickly can my team get started?",
      a: "Starter and Pro are self-serve. Sign up, verify your email, and your first query is seconds away. Team plans include a one-hour onboarding call to configure your custom corpus, user roles, and audit settings.",
    },
  ];

  return (
    <section style={{ padding: "80px 24px", background: C.surface }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <SectionHeading pill pillText="FAQ" h2="Common questions." sub="Not answered here? Email contact@intuixion.ai" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", background: "none", border: "none", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: C.text, lineHeight: 1.4 }}>{f.q}</span>
                <span style={{ color: C.primary, flexShrink: 0 }}>{open === i ? <Minus size={16} /> : <Plus size={16} />}</span>
              </button>
              {open === i && (
                <div style={{ paddingBottom: 20, animation: "fadeIn 0.2s ease" }}>
                  <p style={{ fontSize: 15, color: C.muted, margin: 0, lineHeight: 1.75 }}>{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Security ─────────────────────────────────────────────────────────────────
function Security() {
  const specs = [
    { label: "AES-256",      sub: "Encryption at rest"                     },
    { label: "TLS 1.2+",     sub: "Encryption in transit"                  },
    { label: "POPIA",        sub: "Compliant data processing"              },
    { label: "No training",  sub: "Your data never trains our models"      },
    { label: "SA residency", sub: "Data stays in South Africa (Team plan)" },
  ];
  return (
    <section style={{ padding: "80px 24px", background: C.bg, borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <SectionHeading pill pillText="Security" h2="Built for regulated work." sub="Every query is processed under enterprise security standards designed for legal and compliance environments." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }} className="security-grid">
          {specs.map((s) => (
            <div key={s.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "20px 18px" }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: "0 0 5px", letterSpacing: -0.2 }}>{s.label}</p>
              <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.45 }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA banner ───────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section style={{ padding: "120px 24px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: C.dim, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 20px", fontWeight: 500 }}>
          SA regulation · Answered · Cited
        </p>
        <h2 style={{ fontSize: "clamp(30px, 4.5vw, 56px)", fontWeight: 800, letterSpacing: -2, color: C.text, margin: "0 0 20px", lineHeight: 1.05 }}>
          Trust your intuixion.
        </h2>
        <p style={{ fontSize: 18, color: C.muted, margin: "0 0 44px", lineHeight: 1.7 }}>
          The answer to any SA regulatory question, with the exact source, in 3 seconds.
        </p>
        <a href="mailto:contact@intuixion.ai?subject=Start%20a%20pilot" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.primary, color: "white", textDecoration: "none", padding: "16px 40px", borderRadius: 14, fontWeight: 700, fontSize: 16, transition: "opacity 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
          Start a pilot <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { title: "Product", links: [{ label: "Demo", href: "/demo" }, { label: "How it works", href: "/#how" }, { label: "Pricing", href: "/#pricing" }, { label: "Coverage", href: "/#coverage" }] },
    { title: "Legal",   links: [{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Service", href: "/terms" }, { label: "POPIA Notice", href: "/privacy#popia" }] },
    { title: "Company", links: [{ label: "contact@intuixion.ai", href: "mailto:contact@intuixion.ai" }, { label: "Early access", href: "mailto:contact@intuixion.ai?subject=Early access enquiry" }] },
  ];
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, background: C.surface, padding: "60px 24px 32px" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }} className="footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <LogoMark size={28} />
              <span style={{ color: C.text, fontWeight: 700, fontSize: 15 }}>intuixion<span style={{ color: C.primary }}>.ai</span></span>
            </div>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, maxWidth: 280, margin: "0 0 12px" }}>
              SA regulatory document intelligence for legal, financial, and compliance professionals.
              Built in Cape Town for the African market.
            </p>
            <p style={{ fontSize: 12, color: C.dim, margin: 0 }}>Cape Town, South Africa</p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.text, letterSpacing: 0.8, textTransform: "uppercase", margin: "0 0 16px" }}>{col.title}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {col.links.map((l) => (
                  <a key={l.label} href={l.href} style={{ fontSize: 14, color: C.muted, textDecoration: "none", transition: "color 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>© 2026 intuixion.ai · All rights reserved</p>
          <p style={{ fontSize: 12, color: C.dim, margin: 0 }}>Answers must be verified by a qualified professional. Not legal advice.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <Nav />
      <Hero />
      <ProductDemo />
      <StatsBar />
      <WhoItsFor />
      <HowItWorks />
      <Features />
      <Corpus />
      <Pricing />
      <FAQ />
      <Security />
      <CTABanner />
      <Footer />

      <style jsx global>{`
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        .hidden-mobile { display: flex !important; }
        .show-mobile   { display: none  !important; }
        .how-row-inner { display: grid; grid-template-columns: 72px 1fr 1fr; gap: 32px; align-items: center; }
        @media (max-width: 900px) {
          .how-row-inner  { grid-template-columns: 56px 1fr !important; }
          .how-example    { grid-column: 1 / -1; margin-top: 12px; }
        }
        @media (max-width: 768px) {
          .hidden-mobile  { display: none  !important; }
          .show-mobile    { display: flex  !important; }
          .stats-grid     { grid-template-columns: repeat(2,1fr) !important; }
          .stat-item      { border-right: none !important; border-bottom: 1px solid #e3e0da; }
          .feature-grid   { grid-template-columns: 1fr !important; }
          .features-list  { grid-template-columns: 1fr !important; }
          .corpus-grid    { grid-template-columns: repeat(2,1fr) !important; }
          .footer-grid    { grid-template-columns: 1fr 1fr !important; }
          .problem-row    { grid-template-columns: 1fr !important; gap: 12px !important; }
          .security-grid  { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .corpus-grid   { grid-template-columns: 1fr !important; }
          .footer-grid   { grid-template-columns: 1fr !important; }
          .security-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
